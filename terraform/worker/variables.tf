
variable "do_token" {}
variable "key_fingerprint" {}
variable "worker_count" {
  default = 1
}
variable "load_balancer" {
  default = false
}
variable "stack" {}
