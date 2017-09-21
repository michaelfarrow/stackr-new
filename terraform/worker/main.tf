
provider "digitalocean" {
  version = "~> 0.1"
  token = "${var.do_token}"
}

module "nodes_worker" {
  source = "/modules/node"
  name = "worker-${var.stack}"
  stack = "${var.stack}"
  private_key = "/ssh/id_rsa"
  keys = [
    "${var.key_fingerprint}"
  ]
  nodes = "${var.worker_count}"
  loadbalancer = "${var.load_balancer}"
}

output "ip_public" {
  value = "${zipmap(module.nodes_worker.id, module.nodes_worker.ip_public)}"
}

output "ip_private" {
  value = "${zipmap(module.nodes_worker.id, module.nodes_worker.ip_private)}"
}
