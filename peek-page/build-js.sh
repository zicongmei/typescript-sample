docker build -t typescript-compiler -f Dockerfile.compile .

docker run --rm -v "$(pwd)/dist:/app/dist" typescript-compiler
