
output "id" {
  value = ["${digitalocean_droplet.node.*.id}"]
}

output "ip_public" {
  value = ["${digitalocean_droplet.node.*.ipv4_address}"]
}

output "ip_private" {
  value = ["${digitalocean_droplet.node.*.ipv4_address_private}"]
}
