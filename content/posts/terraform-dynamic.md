+++
title = 'How to Use Terraform Dynamics'
date = 2024-08-27T09:40:33+09:00
draft = false
+++

Terraform is great for static infrastructure, but writing the same resource blocks over and over is a waste of time. If you’re copy-pasting code, you’re just creating more work for your future self. 

These features help you keep your code DRY (Don't Repeat Yourself) so you can spend less time typing and more time actually building things.

#### for_each: Stop Repeating Resources

The `for_each` loop is the easiest way to iterate over a map or set. Instead of writing multiple resource blocks, you define a list and let Terraform do the work.

```hcl
variable "bucket_names" {
  type    = list(string)
  default = ["bucket1", "bucket2", "bucket3"]
}

resource "aws_s3_bucket" "buckets" {
  for_each = toset(var.bucket_names)
  bucket   = each.value
}
```

This creates three buckets with one block. It’s cleaner, and if you need to add a fourth, you just update the variable.

#### Dynamic Blocks: Handling Nested Lists

Dynamic blocks are for when you have repeating blocks *inside* a resource—like security group rules. Writing out ten separate `ingress` blocks is a recipe for frustration.

Traditional way:
```hcl
resource "aws_security_group" "example" {
  name = "example-sg"

  ingress {
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    from_port   = 443
    to_port     = 443
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }
}
```

The better way:
```hcl
variable "ingress_rules" {
  type = list(object({
    from_port   = number
    to_port     = number
    protocol    = string
    cidr_blocks = list(string)
  }))
  default = [
    { from_port = 80, to_port = 80, protocol = "tcp", cidr_blocks = ["0.0.0.0/0"] },
    { from_port = 443, to_port = 443, protocol = "tcp", cidr_blocks = ["0.0.0.0/0"] }
  ]
}

resource "aws_security_group" "example" {
  name = "example-sg"

  dynamic "ingress" {
    for_each = var.ingress_rules
    content {
      from_port   = ingress.value.from_port
      to_port     = ingress.value.to_port
      protocol    = ingress.value.protocol
      cidr_blocks = ingress.value.cidr_blocks
    }
  }
}
```

Now your security group stays manageable, regardless of how many rules you add.

#### Conditionals: Simple Logic

Sometimes you only want a resource if a certain condition is met—like only spinning up a costly RDS instance in production.

```hcl
variable "environment" {
  type    = string
  default = "dev"
}

resource "aws_db_instance" "example" {
  count = var.environment == "production" ? 1 : 0
  # Other parameters here
}
```

If it’s not production, the count is 0, and Terraform skips it. It’s an easy way to keep your AWS bill from ballooning in dev environments.

#### Keep it Simple

Terraform dynamics make code more maintainable, but don't over-engineer things. If you're building a massive recursive loop just to avoid five lines of code, you've probably gone too far. Be efficient, but prioritize readability. Your future self (and your coworkers) will thank you. Things can get scary modifying complex dynamic blocks, so be careful.
