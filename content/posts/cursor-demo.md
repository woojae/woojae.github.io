+++
title = 'Cursor Demo'
date = 2024-09-05T10:22:22+09:00
draft = false
+++

The new popular tool in town is Cursor.ai. Both Paul Graham and Andrej Karpathy tweeted about it, so I decided to see what the hype was all about. As an infrastructure engineer, I tested it by creating infrastructure using Terraform on AWS.

I found Cursor to be quite impressive, though not entirely mind-blowing. It feels like a set of significant user interface improvements to GitHub Copilot. These enhancements are impactful and highly useful. For example, I was able to make changes to Terraform backend, and it automatically applied those backend modifications across all the related Terraform resources.

## Let's use cursor to create an S3 bucket to store our terraform state file

**prompt**

Create a s3 bucket store my terraform state, ensure the bucket is secure from outside world..  
name the bucket cursor-tf-state

Also create a dynamodb to store the lockID.

**Cursor's Response** 

Certainly! I'll create a Terraform configuration to set up an S3 bucket for storing your Terraform state and a DynamoDB table for state locking. Here's the code to accomplish this securely:
This configuration does the following:


1. Creates an S3 bucket named "cursor-tf-state" to store your Terraform state.
2. Enables versioning on the S3 bucket to keep a history of your state files.
3. Configures server-side encryption for the S3 bucket using AES256.
4. Blocks all public access to the S3 bucket to ensure it's secure from the outside world.
5. Creates a DynamoDB table named "cursor-tf-state-locks" for storing lock information.
6. To use this state storage in your other Terraform configurations, you'll need to add a backend configuration. Here's an example of how to do that.

```
provider "aws" {
  region = "us-west-1"  # Replace with your preferred region
}

resource "aws_s3_bucket" "terraform_state" {
  bucket = "cursor-tf-state"

  # Prevent accidental deletion of this S3 bucket
  lifecycle {
    prevent_destroy = true
  }
}

resource "aws_s3_bucket_versioning" "enabled" {
  bucket = aws_s3_bucket.terraform_state.id
  versioning_configuration {
    status = "Enabled"
  }
}

resource "aws_s3_bucket_server_side_encryption_configuration" "default" {
  bucket = aws_s3_bucket.terraform_state.id

  rule {
    apply_server_side_encryption_by_default {
      sse_algorithm = "AES256"
    }
  }
}

resource "aws_s3_bucket_public_access_block" "public_access" {
  bucket                  = aws_s3_bucket.terraform_state.id
  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true
}

resource "aws_dynamodb_table" "terraform_locks" {
  name         = "cursor-tf-state-locks"
  billing_mode = "PAY_PER_REQUEST"
  hash_key     = "LockID"

  attribute {
    name = "LockID"
    type = "S"
  }
}
```

That's pretty good stuff in my opinion.  This is working code produced by the AI.  This terraform code is not that complicated and probably take about 30 minutes to write the code myself.  The AI was able the complete thing in seconds.  That's a 1000x improvement compared to me.

A key highlight of Cursor is the CMD+L shortcut, which lets you quickly ask the AI questions. For example, I used it to ask about DynamoDB attributes, and the answer was quite reliable. Typically, I’d Google this and end up getting distracted, but with the answers directly in the Cursor UI, there's no opportunity to lose focus.

**Cursor's Response**

The attributes you're referring to are part of the DynamoDB table definition in Terraform. Specifically, they are defining the schema for the table that will be used for Terraform state locking. Let's break it down:

1. `name = "LockID"`: This defines the name of the attribute.
2. `type = "S"`: This specifies the data type of the attribute. "S" stands for String.

In the context of Terraform state locking:

- The DynamoDB table is used to implement locking when multiple users or processes are trying to modify the same Terraform state.
- The "LockID" attribute serves as the primary key (hash key) for the DynamoDB table.
- When Terraform acquires a lock, it writes an item to this table with a LockID that's unique to the state file being modified.
- The String type is used because the LockID is typically a string value.

This setup ensures that only one operation can modify the Terraform state at a time, preventing conflicts and race conditions when multiple users are working with the same infrastructure.

## Now that we have a state file. Let's do something with it

Let's ask cursor to create another s3 bucket.

**Prompt**

- create a new s3 bucket name woojae-poop
- use the s3 bucket cursor-tf-state store the terraform state.
- ensure the backend is locking using dynamodb table created in the tfstate directory
- make sure this bucket is not exposed to the outside world.
- enable encryption.
- disable versioning.

**Cursor's Reponse**

```
terraform {
  backend "s3" {
    bucket         = "cursor-tf-state"
    key            = "woojae-poop/terraform.tfstate"
    region         = "us-east-1"  # Change this to your preferred region
    encrypt        = true
    dynamodb_table = "terraform-state-lock"
  }
}

provider "aws" {
  region = "us-east-1"  # Change this to your preferred region
}

resource "aws_s3_bucket" "woojae_poop" {
  bucket = "woojae-poop"
}

resource "aws_s3_bucket_public_access_block" "woojae_poop" {
  bucket = aws_s3_bucket.woojae_poop.id

  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true
}

resource "aws_s3_bucket_server_side_encryption_configuration" "woojae_poop" {
  bucket = aws_s3_bucket.woojae_poop.id

  rule {
    apply_server_side_encryption_by_default {
      sse_algorithm = "AES256"
    }
  }
}

resource "aws_s3_bucket_versioning" "woojae_poop" {
  bucket = aws_s3_bucket.woojae_poop.id
  versioning_configuration {
    status = "Disabled"
  }
}


```

Maybe it was my prompt, but this result was a bit off. I didn’t want to create a new DynamoDB table, and the provider region was incorrect. Since I've done this type of work a lot, I could spot the mistakes easily, but a junior engineer or developer might run this without noticing, creating a mess for me to clean up. Fixing Terraform issues can be extremely difficult. The `terraform import` syntax is awkward and tricky to execute, especially when importing a resource created with a complex modules. Even worse, you could accidentally delete a resource.

Cursor feels like an upgraded version of my current workflow, which combines ChatGPT and GitHub Copilot. The UI improvements reduce the need for copying and pasting, and this technology will keep improving in the future. I've been using AI daily for the past two years, and while it's gotten better, it still feels like we're some time away from making infrastructure engineers completely unnecessary. AI is great at handling basic coding and syntax, but infrastructure engineering involves complex decisions, like determining subnet size, configuring node groups, encrypting S3 buckets, and setting proper permissions for Terraform. 

The "glue" code that infrastructure engineers often manage will likely be the hardest for AI to automate. This code typically bridges gaps between engineering teams, resolves subtle, unintended interactions between different software systems, and accounts for a series of undocumented manual steps performed by some random engineer five years ago.

Here's an interview with the Cursor team.  These guys are amazing.

{{< youtube oFfVt3S51T4 >}}