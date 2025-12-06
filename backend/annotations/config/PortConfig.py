from flask import Flask
import os

class PortConfig:
    @staticmethod
    def get_port():
        return 5002

    @staticmethod
    def run(app: Flask):
        port = PortConfig.get_port()
        app.run(host="0.0.0.0", port=port, debug=True)