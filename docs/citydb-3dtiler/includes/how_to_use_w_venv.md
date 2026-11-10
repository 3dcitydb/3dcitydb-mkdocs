# How to use citydb-3dtiler with Python Virtual Environment??

If you are familiar with common Python application workflows, you can run the software independently of any repository using the instructions below.

## Running Software using Virtual Environment (VEnv)

- [ ] Download the latest release or the main branch in the github repository.

- [ ] Extract the compressed ZIP file and navigate into the folder "citydb-3dtiler-main".

- [ ] Create a Virtual Environment using following command:

=== "on Windows"
    ```powershell
    python -m venv env
    ```

=== "on Unix-based Systems"
    ```bash
    python3 -m venv env
    ```


- [ ] Activate the virtual environment (venv) using following command:

=== "on Windows"
    ```powershell
    .\env\Scripts\Activate
    ```

=== "on Unix-based Systems"
    ```bash
    source env/bin/activate
    ```

??? tip "How to Fix the Security Issue on Windows machines"
    If the virtual environment activation fails on Windows machine, try to type first ```Set-ExecutionPolicy Unrestricted -Scope Process```. Then try to run the Activate command again. 

- [ ] Ensure that the PIP package is updated.

=== "on Windows"
    ```powershell
    python -m pip install --upgrade pip
    ```

=== "on Unix-based Systems"
    ```bash
    python3 -m pip install --upgrade pip
    ```

- [ ] Install the dependent libraries:

=== "on Windows"
    ```powershell
    pip install -r requirements.txt
    ```

=== "on Unix-based Systems"
    ```bash
    pip install -r requirements.txt
    ```

- [ ] Run the Application

=== "on Windows"
    ```powershell
    python citydb-3dtiler.py --help
    ```

=== "on Unix-based Systems"
    ```bash
    python3 citydb-3dtiler.py --help
    ```