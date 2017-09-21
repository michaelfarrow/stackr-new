
output "key_fingerprint" {
  value = "${digitalocean_ssh_key.swarm.fingerprint}"
}

output "key_fingerprints" {
  value = "${digitalocean_ssh_key.user.*.fingerprint}"
}

# output "key_names" {
#   value = "${digitalocean_ssh_key.user.*.name}"
# }
#
# output "keys" {
#   value = "${digitalocean_ssh_key.user.*.public_key}"
# }
