
provider "digitalocean" {
  version = "~> 0.1"
  token = "${var.do_token}"
}

resource "digitalocean_ssh_key" "swarm" {
  name = "Docker Swarm"
  public_key = "${file("/ssh/id_rsa.pub")}"
}

resource "digitalocean_ssh_key" "user" {
  count = "${length(split(",", var.ssh_keys))}"
  name = "${element(split(",", var.ssh_keys), count.index)}"
  public_key = "${file("/config/keys/${element(split(",", var.ssh_keys), count.index)}")}"
}
