
provider "digitalocean" {
  version = "~> 0.1"
  token = "${var.do_token}"
}

module "nodes_manager" {
  source = "/modules/node"
  name = "manager"
  stack = "manager"
  private_key = "/ssh/id_rsa"
  keys = [
    "${var.key_fingerprint}"
  ]
  nodes = "${var.manager_count}"
  loadbalancer = false
}

output "ip_public" {
  value = "${zipmap(module.nodes_manager.id, module.nodes_manager.ip_public)}"
}

output "ip_private" {
  value = "${zipmap(module.nodes_manager.id, module.nodes_manager.ip_private)}"
}
