# Spotto Finance

This is the code for Spotto finance website.

## Prerequisites 

<details>
<summary>Ngninx</summary>

#### Step 1: Install Nginx

```bash
brew install nginx
```

#### Step 2: Start Nginx

```bash
brew services start nginx
```

#### Step 3: Verify Installation
To verify that Nginx is running, open your web browser and navigate to http://localhost. You should see the default Nginx welcome page.

#### Step 4: Configuration
The default configuration file for Nginx installed via Homebrew is located at:
```bash
/usr/local/etc/nginx/nginx.conf
```
#### Step 5: Reload Nginx
```bash
brew services reload nginx
```

#### Step 5: Stop Nginx
```bash
brew services stop nginx
```

</details>

### Move Code from Nicepage to code repository

1. 




## Installation

Follow these steps to set up your project locally:

1. Clone the repository:

   git clone git@github.com:naveenprabhu/spotto-finance.git

## Code formatting

This repo includes Makefile targets to format frontend files (HTML, CSS, JS) using Prettier.

- Install tools (optional):

```bash
make tools
# or if you prefer manual install:
npm init -y
npm install --save-dev prettier
```

- Check formatting (non-destructive):

```bash
make format-check
```

- Format files in-place:

```bash
make format
```

The Makefile commands use `npx prettier` so a global install of Prettier isn't required. If you don't have Node/npm installed, install Node.js first (https://nodejs.org/).
