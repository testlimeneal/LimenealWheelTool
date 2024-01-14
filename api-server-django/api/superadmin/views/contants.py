import os

def get_html_path(file_name):
    script_directory = os.path.dirname(__file__) if __file__ else os.getcwd()
    full_path = os.path.join(script_directory, file_name)
    return full_path
