import Link from "next/link";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import CommandBlock from "@/components/command-block";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export default function HomePage() {
  return (
    <main className="mx-auto max-w-4xl px-4 py-10">
      <header className="mb-8">
        <h1 className="text-balance text-3xl font-semibold">
          Server Setup & Deployment Guide
        </h1>
        <p className="mt-2 text-muted-foreground">
          A structured reference for provisioning Ubuntu servers, deploying
          Node/React/Next/Strapi apps, and configuring Nginx/Apache with SSL.
        </p>
      </header>

      <section className="space-y-6">
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="step-1">
            <AccordionTrigger>Step 1 — Base server setup</AccordionTrigger>
            <AccordionContent className="space-y-4">
              <div>
                <h3 className="font-medium">Update, upgrade, cleanup</h3>
                <p className="text-muted-foreground">
                  This updates packages, upgrades, removes unused files, and
                  cleans cache.
                </p>
                <CommandBlock
                  label="Apt maintenance"
                  commands={[
                    "sudo apt update && sudo apt upgrade -y && sudo apt update && sudo apt autoremove -y && sudo apt clean",
                  ]}
                />
              </div>

              <div>
                <h3 className="font-medium">Install basic packages</h3>
                <CommandBlock
                  label="Essentials"
                  commands={["sudo apt install -y zip unzip curl wget git"]}
                />
              </div>

              <div className="space-y-2">
                <h3 className="font-medium">
                  Install Node.js with NVM and Yarn
                </h3>
                <Alert>
                  <AlertTitle>Important — Use Option 3</AlertTitle>
                  <AlertDescription>
                    Follow Option 3 in the guide:{" "}
                    <Link
                      href="https://www.digitalocean.com/community/tutorials/how-to-install-node-js-on-ubuntu-20-04"
                      className="underline underline-offset-4"
                      target="_blank"
                      rel="noreferrer"
                    >
                      DigitalOcean: Install Node.js on Ubuntu 20.04
                    </Link>
                  </AlertDescription>
                </Alert>
                <p className="text-muted-foreground">
                  Install Node LTS version using nvm:
                </p>
                <CommandBlock
                  label="Node via NVM"
                  commands={["nvm install <version>", "node -v"]}
                />
              </div>

              <div>
                <h3 className="font-medium">Install Nginx</h3>
                <CommandBlock
                  label="Nginx"
                  commands={["sudo apt install -y nginx"]}
                />
              </div>

              <div className="space-y-2">
                <h3 className="font-medium">Install and configure PM2</h3>
                <CommandBlock
                  label="PM2 global install"
                  commands={["npm install -g pm2"]}
                />
                <CommandBlock
                  label="PM2 basics"
                  commands={[
                    "pm2 list",
                    "sudo pm2 startup   # run only once on a fresh server",
                    "pm2 save           # save current PM2 process list",
                  ]}
                />
                <p className="text-muted-foreground">
                  If PM2 services disappear after reboot, set up resurrection
                  via crontab:
                </p>
                <CommandBlock
                  label="PM2 resurrect on reboot"
                  commands={[
                    "crontab -e         # select nano if prompted",
                    "@reboot /usr/bin/pm2 resurrect",
                    "pm2 save",
                    "sudo reboot        # reconnect after a few minutes",
                    "pm2 list",
                  ]}
                />
                <CommandBlock
                  label="Restart and tail logs for process index 0"
                  commands={["pm2 restart 0 && pm2 logs 0"]}
                />
              </div>

              <div>
                <h3 className="font-medium">
                  Create project folder(s) in /var/www
                </h3>
                <p className="text-muted-foreground">
                  Examples: project-demo-api, project-demo-api-dev,
                  project-demo, project-demo-dev
                </p>
                <CommandBlock
                  label="Create folder"
                  commands={["sudo mkdir /var/www/project-demo-api"]}
                />
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="step-2a1">
            <AccordionTrigger>
              Step 2 (a1) — Initialize git repo (SSH)
            </AccordionTrigger>
            <AccordionContent className="space-y-4">
              <p className="text-muted-foreground">
                Initialize and set SSH remote.
              </p>
              <CommandBlock
                label="Git init + add SSH origin"
                commands={[
                  "cd /var/www/project-demo-api",
                  "git init",
                  "git remote add origin <ssh clone url>",
                  "git remote -v",
                ]}
              />
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="step-2a2">
            <AccordionTrigger>Step 2 (a2) — Clone repo (HTTP)</AccordionTrigger>
            <AccordionContent>
              <CommandBlock
                label="Clone via HTTP"
                commands={["git clone <http clone url>"]}
              />
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="step-2b">
            <AccordionTrigger>
              Step 2 (b) — Checkout development and initialize
            </AccordionTrigger>
            <AccordionContent className="space-y-4">
              <CommandBlock
                label="Fetch and checkout"
                commands={[
                  "git fetch origin development",
                  "git checkout development",
                ]}
              />
              <CommandBlock
                label="Environment and install"
                commands={[
                  "cp -r .env.development .env",
                  "yarn",
                  "yarn run init",
                ]}
              />
              <CommandBlock
                label="Pull latest"
                commands={["git pull origin development"]}
              />
              <div>
                <h4 className="font-medium">
                  Find an available port and set it in env
                </h4>
                <CommandBlock
                  label="List listening ports"
                  commands={["netstat -tulnp | grep LISTEN"]}
                />
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="deploy-react">
            <AccordionTrigger>Deploy React (Vite)</AccordionTrigger>
            <AccordionContent className="space-y-2">
              <p className="text-muted-foreground">
                Build your app locally (dist) or upload dist to the server, then
                serve with PM2.
              </p>
              <CommandBlock
                label="Serve dist with PM2 (SPA)"
                commands={[
                  'pm2 serve dist/ 7002 --spa --name "7002-vayu-admin"',
                ]}
              />
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="deploy-next">
            <AccordionTrigger>Deploy Next.js</AccordionTrigger>
            <AccordionContent className="space-y-4">
              <p className="text-muted-foreground">
                Upload .next, next.config.mjs, .env, package.json, and public,
                then start with PM2.
              </p>
              <CommandBlock
                label="Start Next via npm"
                commands={[
                  "yarn",
                  "pm2 start npm --name 'NAME' -- run 'next start -p PORT'",
                ]}
              />
              <p className="text-muted-foreground">Or using yarn directly:</p>
              <CommandBlock
                label="Start Next via yarn"
                commands={[
                  "yarn",
                  "pm2 start yarn --name 'NAME' -- start -p PORT",
                ]}
              />
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="deploy-strapi">
            <AccordionTrigger>Deploy Strapi</AccordionTrigger>
            <AccordionContent>
              <CommandBlock
                label="Start Strapi"
                commands={["pm2 start npm --name 'NAME' -- run start"]}
              />
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="apache">
            <AccordionTrigger>If using Apache</AccordionTrigger>
            <AccordionContent className="space-y-3">
              <ol className="list-inside list-decimal space-y-1 text-muted-foreground">
                <li>{"Install Apache"}</li>
                <li>{"Create project folder(s) and set permissions."}</li>
                <li>
                  {
                    "Create /etc/apache2/sites-available/host.conf (virtual host)."
                  }
                </li>
                <li>{"Reload Apache and enable site."}</li>
                <li>{"Issue HTTPS certificate via Certbot."}</li>
              </ol>
              <CommandBlock
                label="Apache enable site"
                commands={[
                  "sudo systemctl reload apache2",
                  "sudo a2ensite host.conf",
                ]}
              />
              <CommandBlock
                label="Certbot (Apache)"
                commands={["sudo certbot --apache"]}
              />
              <p className="text-muted-foreground">
                Reference:{" "}
                <Link
                  href="https://www.digitalocean.com/community/tutorials/how-to-secure-apache-with-let-s-encrypt-on-ubuntu-18-04"
                  className="underline underline-offset-4"
                  target="_blank"
                  rel="noreferrer"
                >
                  DigitalOcean: Secure Apache with Let’s Encrypt
                </Link>
              </p>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="nginx">
            <AccordionTrigger>If using Nginx</AccordionTrigger>
            <AccordionContent className="space-y-4">
              <CommandBlock
                label="Install Nginx"
                commands={["sudo apt install -y nginx"]}
              />
              <ol className="list-inside list-decimal space-y-1 text-muted-foreground">
                <li>{"Create project folder(s) and set permissions."}</li>
                <li>
                  {
                    "Create /etc/nginx/sites-available/host.conf (virtual host)."
                  }
                </li>
                <li>{"Enable config via symlink in sites-enabled."}</li>
                <li>{"Test config and restart Nginx."}</li>
              </ol>
              <CommandBlock
                label="Enable site and test"
                commands={[
                  "cd /etc/nginx/sites-enabled/",
                  "ln -s ../sites-available/host.conf ../sites-enabled/host.conf",
                  "sudo nginx -t",
                  "sudo systemctl restart nginx",
                  "# if apache2 is running:",
                  "sudo systemctl stop apache2",
                ]}
              />
              <div className="space-y-2">
                <h4 className="font-medium">Install Certbot for Nginx</h4>
                <CommandBlock
                  label="Certbot install"
                  commands={[
                    "sudo apt install -y certbot python3-certbot-nginx",
                  ]}
                />
                <p className="text-muted-foreground">
                  Troubleshooting:{" "}
                  <Link
                    href="https://stackoverflow.com/questions/53223914/issue-using-certbot-with-nginx"
                    className="underline underline-offset-4"
                    target="_blank"
                    rel="noreferrer"
                  >
                    Stack Overflow: certbot with nginx
                  </Link>
                </p>
                <CommandBlock
                  label="Obtain/renew SSL"
                  commands={["sudo certbot --nginx"]}
                />
                <CommandBlock
                  label="Renewal commands"
                  commands={[
                    "sudo certbot renew --dry-run",
                    "sudo certbot renew",
                    "sudo certbot --nginx -d (DOMAIN)",
                  ]}
                />
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="git-ssh">
            <AccordionTrigger>Git SSH keys and access</AccordionTrigger>
            <AccordionContent className="space-y-4">
              <p className="text-muted-foreground">
                If your server’s SSH key isn’t added to your Git host
                (GitLab/GitHub), you may see repeated username/password prompts.
              </p>
              <div>
                <h4 className="font-medium">Generate SSH keys</h4>
                <p className="text-muted-foreground">ECDSA/Ed25519:</p>
                <CommandBlock label="Ed25519 key" commands={["ssh-keygen"]} />
                <p className="text-muted-foreground">RSA (4096 bits):</p>
                <CommandBlock
                  label="RSA key"
                  commands={["ssh-keygen -t rsa -b 4096"]}
                />
                <p className="text-muted-foreground">
                  Guide:{" "}
                  <Link
                    href="https://www.digitalocean.com/community/tutorials/how-to-set-up-ssh-keys-on-ubuntu-20-04"
                    className="underline underline-offset-4"
                    target="_blank"
                    rel="noreferrer"
                  >
                    DigitalOcean: Set up SSH keys
                  </Link>
                </p>
                <CommandBlock
                  label="Show public key"
                  commands={["cd ~/.ssh", "cat id_rsa.pub"]}
                />
              </div>
              <div>
                <h4 className="font-medium">Troubleshooting remotes</h4>
                <p className="text-muted-foreground">
                  Ensure your remote uses SSH:
                </p>
                <CommandBlock
                  label="Switch to SSH remote"
                  commands={[
                    "git remote set-url origin <ssh clone url>",
                    "git remote -v",
                  ]}
                />
                <p className="text-muted-foreground">
                  Alternatively, use HTTPS with a token:
                </p>
                <CommandBlock
                  label="HTTPS remote with token"
                  commands={[
                    "git remote set-url origin https://${username}:${token}@gitlab.com/DDPATEL/doorlight-backend.git",
                  ]}
                />
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="users-perms">
            <AccordionTrigger>Users, permissions, and fixes</AccordionTrigger>
            <AccordionContent className="space-y-4">
              <div>
                <h4 className="font-medium">Switch user</h4>
                <CommandBlock
                  label="To root and back"
                  commands={["sudo su", "exit"]}
                />
              </div>
              <div>
                <h4 className="font-medium">
                  Permission issue during npm install
                </h4>
                <p className="text-muted-foreground">
                  If files fail to create during install:
                </p>
                <CommandBlock
                  label="Relax permissions (recursive)"
                  commands={["sudo chmod -R 777 <project name>"]}
                />
              </div>
              <div>
                <h4 className="font-medium">Folder permission structure</h4>
                <Link
                  href="https://remy.parkland.edu/~smauney/csc128/permissions_and_links.html"
                  className="underline underline-offset-4"
                  target="_blank"
                  rel="noreferrer"
                >
                  Permissions and links reference
                </Link>
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="password-ssh">
            <AccordionTrigger>Password auth and SSH config</AccordionTrigger>
            <AccordionContent className="space-y-4">
              <div>
                <h4 className="font-medium">Set a password for user</h4>
                <CommandBlock
                  label="Set password for ubuntu user"
                  commands={["sudo su", "passwd ubuntu"]}
                />
              </div>
              <div>
                <h4 className="font-medium">Update SSH config</h4>
                <p className="text-muted-foreground">
                  Edit /etc/ssh/sshd_config and change these to yes:
                </p>
                <ul className="list-inside list-disc text-muted-foreground">
                  <li>{"PasswordAuthentication yes"}</li>
                  <li>{"KbdInteractiveAuthentication yes"}</li>
                  <li>{"ChallengeResponseAuthentication yes"}</li>
                </ul>
                <p className="text-muted-foreground">Or set:</p>
                <ul className="list-inside list-disc text-muted-foreground">
                  <li>{"PasswordAuthentication yes"}</li>
                  <li>{"PermitRootLogin yes"}</li>
                </ul>
                <CommandBlock
                  label="Restart SSH"
                  commands={[
                    "sudo service sshd restart || sudo service ssh restart",
                    "sudo systemctl restart sshd || sudo systemctl restart ssh",
                  ]}
                />
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="disk-space">
            <AccordionTrigger>Server disk space checks</AccordionTrigger>
            <AccordionContent className="space-y-4">
              <div>
                <h4 className="font-medium">Check folder sizes</h4>
                <CommandBlock
                  label="Folder sizes"
                  commands={["du -h --max-depth=1"]}
                />
              </div>
              <div>
                <h4 className="font-medium">Check overall disk usage</h4>
                <p className="text-muted-foreground">
                  /dev/vda1 is commonly the storage device.
                </p>
                <CommandBlock label="Disk usage" commands={["df -h"]} />
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="ssh-connect">
            <AccordionTrigger>Connect to server via SSH</AccordionTrigger>
            <AccordionContent>
              <CommandBlock
                label="SSH with PEM"
                commands={['ssh -i "${pem file name}" ubuntu@${ip}']}
              />
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="bucket">
            <AccordionTrigger>Create bucket</AccordionTrigger>
            <AccordionContent className="space-y-2">
              <p className="text-muted-foreground">
                Follow your cloud provider’s instructions (AWS S3, GCP Storage,
                etc.) to create a bucket and capture access credentials for your
                app.
              </p>
            </AccordionContent>
          </AccordionItem>
        </Accordion>

        <div className="pt-6">
          <Button asChild>
            <Link href="#top">Back to top</Link>
          </Button>
        </div>
      </section>
    </main>
  );
}
