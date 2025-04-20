# Arch Linux Development Dependencies

The package names `libuv1-dev` and `libopus-dev` are Debian/Ubuntu package names. On Arch Linux, you need to install the following packages instead:

## Install the correct packages:

```bash
sudo pacman -S libuv opus
```

These packages provide:
- `libuv` - The libuv library for asynchronous I/O
- `opus` - The Opus audio codec library

If you need the development headers (which you typically do for compiling software), Arch Linux already includes them in the main packages, unlike Debian-based systems that separate them into `-dev` packages.

## Additional development tools you might need:

```bash
sudo pacman -S base-devel
```

This package group includes common build tools like gcc, make, and pkg-config that are often needed for compilation.

