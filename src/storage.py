import ipfshttpclient
import os
import uuid
from Crypto.Cipher import AES
from Crypto.Random import get_random_bytes
import math
import json

CHUNK_SIZE = 1024 * 1024  # 1MB chunks
DOWNLOADS_DIR = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'downloads')
os.makedirs(DOWNLOADS_DIR, exist_ok=True)

class IPFSStorage:
    def __init__(self):
        try:
            self.client = ipfshttpclient.connect(
                '/ip4/127.0.0.1/tcp/5001',
                timeout=30  # 30 second timeout
            )
        except Exception as e:
            print(f"Failed to connect to IPFS: {e}")
            raise

    def _pad(self, data):
        pad_len = AES.block_size - len(data) % AES.block_size
        return data + bytes([pad_len]) * pad_len

    def _unpad(self, data):
        pad_len = data[-1]
        return data[:-pad_len]

    def _encrypt_chunk(self, chunk, key):
        iv = get_random_bytes(AES.block_size)
        cipher = AES.new(key, AES.MODE_CBC, iv)
        encrypted = cipher.encrypt(self._pad(chunk))
        return iv + encrypted

    def _decrypt_chunk(self, chunk, key):
        iv = chunk[:AES.block_size]
        encrypted = chunk[AES.block_size:]
        cipher = AES.new(key, AES.MODE_CBC, iv)
        decrypted = cipher.decrypt(encrypted)
        return self._unpad(decrypted)

    def upload(self, file, user_id):
        """Upload a file to IPFS with chunking and encryption, pin the root hash for the user"""
        try:
            if not file:
                raise ValueError("No file provided")
            if not hasattr(file, 'read'):
                raise ValueError("Invalid file object")

            # Read file content
            file.seek(0)
            data = file.read()

            # Generate AES key for encryption
            key = get_random_bytes(32)  # AES-256 key

            # Split into chunks
            total_chunks = math.ceil(len(data) / CHUNK_SIZE)
            chunk_hashes = []

            for i in range(total_chunks):
                chunk_data = data[i*CHUNK_SIZE:(i+1)*CHUNK_SIZE]
                encrypted_chunk = self._encrypt_chunk(chunk_data, key)
                # Upload encrypted chunk to IPFS
                res = self.client.add_bytes(encrypted_chunk)
                chunk_hashes.append(res)

            # Create Merkle tree root hash (simplified as hash of concatenated chunk hashes)
            merkle_root_data = ''.join(chunk_hashes).encode('utf-8')
            merkle_root_hash = self.client.add_bytes(merkle_root_data)

            # Pin the root hash for the user
            self.client.pin.add(merkle_root_hash)

            # Store user pin info (this will be handled outside this method)

            # Save encryption key, chunk hashes, and original filename metadata to a JSON file locally for download use
            metadata = {
                'key': key.hex(),
                'chunks': chunk_hashes,
                'filename': file.filename if hasattr(file, 'filename') else 'downloaded_file'
            }
            metadata_path = os.path.join(DOWNLOADS_DIR, f'{merkle_root_hash}_metadata.json')
            with open(metadata_path, 'w') as f:
                json.dump(metadata, f)

            print(f"Successfully uploaded file with Merkle root hash: {merkle_root_hash}")
            return merkle_root_hash, chunk_hashes

        except Exception as e:
            print(f"Error uploading to IPFS: {str(e)}")
            raise

    def download(self, merkle_root_hash):
        """Download a file from IPFS by retrieving chunks, decrypting, and reassembling"""
        try:
            # Load metadata
            metadata_path = os.path.join(DOWNLOADS_DIR, f'{merkle_root_hash}_metadata.json')
            if not os.path.exists(metadata_path):
                # Try to create metadata file if missing by scanning downloads directory for matching chunks
                print(f"Metadata file not found for hash {merkle_root_hash}, attempting to create it.")
                # This is a placeholder for actual logic to recreate metadata if possible
                # For now, return None to indicate failure
                return None

            with open(metadata_path, 'r') as f:
                metadata = json.load(f)

            key = bytes.fromhex(metadata['key'])
            chunk_hashes = metadata['chunks']
            filename = metadata.get('filename', f'{merkle_root_hash}_downloaded')

            decrypted_data = b''

            for chunk_hash in chunk_hashes:
                encrypted_chunk = self.client.cat(chunk_hash)
                decrypted_chunk = self._decrypt_chunk(encrypted_chunk, key)
                decrypted_data += decrypted_chunk

            # Save reassembled file locally with original filename
            output_path = os.path.join(DOWNLOADS_DIR, filename)
            with open(output_path, 'wb') as f:
                f.write(decrypted_data)

            print(f"Successfully downloaded and reassembled file to {output_path}")
            # Do not delete metadata json file after download
            return output_path, chunk_hashes

        except Exception as e:
            print(f"Error downloading from IPFS: {e}")
            return None

def upload_to_ipfs(file, user_id=None):
    """Upload a file to IPFS with encryption and chunking"""
    storage = IPFSStorage()
    return storage.upload(file, user_id)

def download_from_ipfs(file_hash):
    """Download a file from IPFS with decryption and reassembly"""
    storage = IPFSStorage()
    return storage.download(file_hash)
