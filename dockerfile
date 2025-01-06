FROM mcr.microsoft.com/playwright:focal

RUN apt-get update && apt-get install -y curl openvpn

COPY vpn-config.ovpn /etc/openvpn/config.ovpn

WORKDIR /workspace

COPY entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

ENTRYPOINT ["/entrypoint.sh"]
