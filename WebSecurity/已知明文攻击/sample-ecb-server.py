import socketserver
import zlib
import os
import struct
from Crypto.Cipher import DES
from Crypto.Util.Padding import pad, unpad

BLOCK_SIZE = 32 # Bytes
secret = "a5Sdfg#$fu7\x9f43aZxcrwe%&0988"

def encrypt(data):
    print('encrypt: %s ' % (data))
    
    des = DES.new('01234567'.encode(), DES.MODE_ECB)
   
    #data += b'\x00'.decode() * (8 - len(data) % 8)
    
    edata = des.encrypt(pad(data.encode(),BLOCK_SIZE))
    print(edata)
    return edata

def send_blob(s, data):
    s.sendall(struct.pack('<I', len(data)))
    s.sendall(data)
    return

def recv_blob(s):
    data = s.recv(4)
    length, = struct.unpack('<I', data)

    data = b''
    while len(data) < length:
        newdata = s.recv(length - len(data))
        if newdata == '':
            raise Exception('connection closed?')
        data += newdata

    return data

class MyTCPHandler(socketserver.BaseRequestHandler):

    def handle(self):
        # self.request is the TCP socket connected to the client

        plaintext = recv_blob(self.request)
        message = "data=%s,secret=%s" % (plaintext, secret)
        print(message)
        ciphertext = encrypt(message)
        send_blob(self.request, ciphertext)

        self.request.close()
        return

if __name__ == "__main__":
    HOST, PORT = "0.0.0.0", 30000
    print('now begin: ')
    # Create the server, binding to localhost on port 9999
    socketserver.allow_reuse_address = True
    server = socketserver.TCPServer((HOST, PORT), MyTCPHandler)
    
    # Activate the server; this will keep running until you
    # interrupt the program with Ctrl-C
    server.serve_forever()