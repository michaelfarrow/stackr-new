
variable "depends_on" {
  type = "list"
  default = []
}

variable "private_key" {}

variable "name" {}

variable "stack" {}

variable "nodes" {
  default = 1
}

variable "loadbalancer" {
  default = false
}

variable "region" {
  default = "lon1"
}

variable "size" {
  default = "512mb"
}

variable "keys" {
  type = "list"
  default = []
}
