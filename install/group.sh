#!/bin/env bash

# Global variables
DIRECTORIES=("/etc/nanocl" "/var/run/nanocl" "/var/lib/nanocl" "/var/log/nanocl")

# Verify if we are root
if [ "$(id -u)" -ne 0 ] ; then
    echo "This script must be executed with root privileges."
    exit 1
fi

# Create group if not exists
if [ $(getent group nanocl) ]; then
  echo "group nanocl exists."
else
  echo "group nanocl does not exist."
  echo "creating.."
  groupadd nanocl
fi

# Create directories
echo "Creating directories"
for element in "${DIRECTORIES[@]}"
do
    echo "creating $element"
    mkdir -p $element
    chown root:nanocl -R $element
done
