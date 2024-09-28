import os
import re
import hashlib
import math

def calculate_file_size(firmware_path):
    return os.path.getsize(firmware_path)

def calculate_md5_hash(firmware_path):
    with open(firmware_path, 'rb') as file:
        return hashlib.md5(file.read()).hexdigest()

def detect_file_format(firmware_path):
    with open(firmware_path, 'rb') as file:
        magic_bytes = file.read(4)
        if magic_bytes == b'\x7FELF':
            return "ELF"
        elif magic_bytes[0:2] == b'MZ':
            return "PE"
        else:
            return "BIN"

def detect_strings(firmware_path, min_length=4):
    with open(firmware_path, 'rb') as file:
        data = file.read()
        strings = set()
        for match in re.finditer(rb'[A-Za-z0-9/\-:.,_$%()[\]<> ]{' + str(min_length).encode() + rb',}', data):
            strings.add(match.group().decode('ascii', errors='ignore'))
        return strings

def detect_urls_and_ips(firmware_path):
    url_pattern = re.compile(r'(?:http|ftp)s?://(?:(?:[A-Z0-9](?:[A-Z0-9-]{0,61}[A-Z0-9])?\.)+(?:[A-Z]{2,6}\.?|[A-Z0-9-]{2,}\.?)|localhost|\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3})(?::\d+)?(?:/?|[/?]\S+)', re.IGNORECASE)
    ip_pattern = re.compile(r'\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}')

    urls = set()
    ips = set()

    with open(firmware_path, 'rb') as file:
        data = file.read()
        urls.update(url_pattern.findall(data.decode('ascii', errors='ignore')))
        ips.update(ip_pattern.findall(data.decode('ascii', errors='ignore')))

    return urls, ips

def detect_packing(firmware_path):
    with open(firmware_path, 'rb') as file:
        data = file.read()
        packers = [
            (b'UPX', 'UPX'),
            (b'FSG', 'FSG'),
            (b'PECompact', 'PECompact'),
            (b'ASPack', 'ASPack'),
            (b'Themida', 'Themida')
        ]
        for signature, packer in packers:
            if signature in data:
                return packer
    return None

def detect_architecture(firmware_path):
    with open(firmware_path, 'rb') as file:
        data = file.read(64)  # Read the first 64 bytes
        if b'ARM' in data:
            return 'ARM'
        elif b'MIPS' in data:
            return 'MIPS'
        elif b'x86' in data:
            return 'x86'
        else:
            return 'Unknown'

def calculate_entropy(firmware_path):
    with open(firmware_path, 'rb') as file:
        data = file.read()
        byte_counts = [0] * 256
        for byte in data:
            byte_counts[byte] += 1

        entropy = 0
        for count in byte_counts:
            if count > 0:
                probability = count / len(data)
                entropy -= probability * math.log2(probability)

        return entropy

def extract_metadata(firmware_path):
    metadata = {}
    with open(firmware_path, 'rb') as file:
        data = file.read()
        version_match = re.search(rb'(?i)version[^\w\d]*([\w\d.]+)', data)
        if version_match:
            metadata['version'] = version_match.group(1).decode('ascii', errors='ignore')
        else:
            metadata['version'] = "None found"

        build_date_match = re.search(rb'(?i)build[^\w\d]*([\w\d/-]+)', data)
        if build_date_match:
            metadata['build_date'] = build_date_match.group(1).decode('ascii', errors='ignore')
        else:
            metadata['build_date'] = "None found"

        developer_match = re.search(rb'(?i)developer[^\w\d]*([\w\d\s]+)', data)
        if developer_match:
            metadata['developer'] = developer_match.group(1).decode('ascii', errors='ignore')
        else:
            metadata['developer'] = "None found"

    return metadata

def analyze_user_interface(firmware_path):
    ui_resources = []
    with open(firmware_path, 'rb') as file:
        data = file.read()
        image_extensions = ['.png', '.jpg', '.bmp', '.gif']
        font_extensions = ['.ttf', '.otf', '.fnt']

        for ext in image_extensions:
            matches = re.finditer(re.escape(ext.encode()), data, re.IGNORECASE)
            for match in matches:
                ui_resources.append(('image', match.start(), ext))

        for ext in font_extensions:
            matches = re.finditer(re.escape(ext.encode()), data, re.IGNORECASE)
            for match in matches:
                ui_resources.append(('font', match.start(), ext))

    return ui_resources

def analyze_cryptography(firmware_path):
    crypto_algos = []
    with open(firmware_path, 'rb') as file:
        data = file.read()
        crypto_constants = {
            'AES': [b'AES', b'Rijndael'],
            'DES': [b'DES'],
            'RSA': [b'RSA'],
            'SHA-1': [b'SHA1', b'SHA-1'],
            'SHA-256': [b'SHA256', b'SHA-256'],
            'MD5': [b'MD5']
        }

        for algo, constants in crypto_constants.items():
            for const in constants:
                if const in data:
                    crypto_algos.append(algo)
                    break

    return list(set(crypto_algos))

def get_crypto_description(algo):
    descriptions = {
        'AES': 'Advanced Encryption Standard (AES) is a symmetric encryption algorithm used for secure communication.',
        'DES': 'Data Encryption Standard (DES) is a symmetric-key algorithm for encryption.',
        'RSA': 'RSA is a widely used asymmetric encryption algorithm for secure data transmission.',
        'SHA-1': 'SHA-1 is a cryptographic hash function that produces a 160-bit hash value.',
        'SHA-256': 'SHA-256 is a cryptographic hash function that generates a 256-bit hash value.',
        'MD5': 'MD5 is a widely used hash function that produces a 128-bit hash value.'
    }
    return descriptions.get(algo, 'No description available.')

def detect_potential_passwords(strings, min_length=8, max_length=64, min_entropy=3.0, top_n=10):
    potential_passwords = []

    for pwd in strings:
        if min_length <= len(pwd) <= max_length and ' ' not in pwd and not pwd.startswith(('http://', 'https://')) and ")http://" not in pwd:
            entropy = calculate_password_entropy(pwd)
            if entropy >= min_entropy:
                potential_passwords.append((pwd, entropy))

    potential_passwords.sort(key=lambda x: x[1], reverse=True)
    return [pwd for pwd, _ in potential_passwords[:top_n]]

def calculate_password_entropy(password):
    char_space = 0
    if re.search(r'[a-z]', password):
        char_space += 26
    if re.search(r'[A-Z]', password):
        char_space += 26
    if re.search(r'[0-9]', password):
        char_space += 10
    if re.search(r'[!@#$%^&*(),.?":{}|<>]', password):
        char_space += 32

    password_entropy = len(password) * math.log2(char_space)
    return password_entropy

def analyze_firmware(firmware_path):
    result = {}
    
    # File Size and Hash
    result["file_size"] = f"{calculate_file_size(firmware_path)} bytes"
    result["md5_hash"] = calculate_md5_hash(firmware_path)
    result["file_format"] = detect_file_format(firmware_path)

    # URLs and IPs
    urls, ips = detect_urls_and_ips(firmware_path)
    result["urls"] = list(urls) if urls else "None found"
    result["ips"] = list(ips) if ips else "None found"

    # Packing, Architecture, and Entropy
    result["packing"] = detect_packing(firmware_path) or "No packing detected"
    result["architecture"] = detect_architecture(firmware_path)

    entropy = calculate_entropy(firmware_path)
    result["entropy"] = f"{entropy:.2f}"
    if entropy > 7.0:
        result["entropy_analysis"] = "High entropy suggests the presence of encrypted or compressed data."
    elif entropy > 5.0:
        result["entropy_analysis"] = "Moderate entropy suggests the presence of compressed or obfuscated data."
    else:
        result["entropy_analysis"] = "Low entropy suggests the presence of plain text or executable code."

    # Metadata
    result["metadata"] = extract_metadata(firmware_path)

    # UI Resources
    ui_resources = analyze_user_interface(firmware_path)
    result["ui_resources"] = [f"{r[0].capitalize()} at offset {r[1]} with extension {r[2]}" for r in ui_resources] or "None found"

    # Cryptographic Algorithms and Descriptions
    crypto_algos = analyze_cryptography(firmware_path)
    if crypto_algos:
        result["crypto_algorithms"] = crypto_algos
        result["crypto_analysis"] = []
        for algo in crypto_algos:
            description = get_crypto_description(algo)
            result["crypto_analysis"].append(f"{algo}: {description}")
    else:
        result["crypto_algorithms"] = "None found"
        result["crypto_analysis"] = "No cryptographic algorithms found."

    # Detect Strings (length >= 5)
    strings = detect_strings(firmware_path, min_length=5)
    
    # Potential Passwords
    potential_passwords = detect_potential_passwords(strings)
    if potential_passwords:
        result["top_10_passwords"] = potential_passwords
        result["password_analysis"] = "The detected strings contain potential passwords that should be reviewed."
    else:
        result["top_10_passwords"] = "None found"
        result["password_analysis"] = "No potential passwords were detected."

    result["detected_strings"] = ', '.join(strings) if strings else "None found"

    return result



