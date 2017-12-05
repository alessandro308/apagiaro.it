---
layout: post
title:  "An introduction to Docker Swarm"
date:   2017-12-5
excerpt: "A Docker-native clustering system."
tag:
- english
- docker
feature: https://communities.bmc.com/servlet/JiveServlet/showImage/102-46538-4-232915/Docker+Swarm+v2.png
comments: true
---
_This are a personal notes about Docker Swarm, derivated by Documentation._

![Docker Swarm Logo](https://communities.bmc.com/servlet/JiveServlet/showImage/102-46538-4-232915/Docker+Swarm+v2.png)

Docker Swarm is a Docker-native clustering system. It turns a pool of Docker hosts into a single, virtual host.

# Feature highlights
 - Cluster management integrated with Docker Engine
 - Scaling
 - Desired state reconciliation
 - Multi-host networking
 - Load balancing
 - Secure by default
 - Rolling updates

# Key Concepts
A swarm consists of multiple Docker hosts which run is swarm mode and act as managers and workers. A given Docker hosts can be a manager, a worker or performs both roles.

When you create a service, you define its optimal state (number of replicas, network and storage resources available to it, ports the service exposes to the outside world, and more).
**Docker works to maintain that desired state.**
If a worker becames unavaiable, Docker schedules that's _tasks_ on other nodes. (A task is a running container which is part of swarm service and managed by a swarm manager).

Pro
You can modify a service's configuration without the need to manually restart the service. Docker will update the swarm to fit new configuration.

### Node
A node is an instace of Docker engine. You can run one or more nodes on a single physical computer (`docker-machine`), but tipically each node runs on a different computer.

### Load balancing
The swarm manager uses ingress load balancing to expose the services you want to make available externally to the swarm.
Swarm mode has an internal DNS component that automatically assigns each service in the swarm a DNS entry. The swarm manager uses internal load balancing to distribute requests among services within the cluster based upon the DNS name of the service.

# How Works
## Nodes
### Manager nodes
Manager nodes handle cluster managament tasks:
- Mantaining cluster state
- scheduling services
- serving swarm mode HTTP API endpoints

The internal state is mantained using a [Raft algorithm](https://raft.github.io/raft.pdf). If a manager fails (and there are no more managers), the service will continue to run, but you will need to create a new cluster to recover.

### Worker nodes
Worker nodes are instances of Docker Engine whose unique purpore is to execute containers.
By default, all managers are also workers. To prevent this, set `--availability` to `Drain`. The scheduler gracefully stops tasks on nodes in Drain mode and schedules the tasks on an Active node.

## Services
A service is frequently an image for a microservice within the context of some larger application (HTTP Server, database, or any other distributed environment).

When you define a service, you specify, optionally, in addition to image, 
 - the port where the swarm will make the service available outside the swarm
 - an overlay network to connect to other services in the swarm
 - CPU and memory limits
 - a rolling update policy
 - the number of replicas of the image to run in the swarm

 The services can be of two types:
  - replicated, when you specify the number of identical tasks you want to run (web services...)
  - global, when runs one task on every node (monitoring agents, antivirus...)

## Security
The swarm mode public key infrastructure (PKI) system build into Docker makes it simple to securely deploy a container orchestration system. The nodes use TLS to authenticate, authorize and encrypt the communication with other nodes. 
When you create a new swarm manager, it create a new root Certificate Authority which are used to secure communication with other nodes.

# Deploy a service
`docker service create --name web nginx`
This command create a service, called "web", that run nginx image.
Now you can change all the configurations using `docker service update` command.
`docker service update --publish-add 80 web`
To remove a service, simply do, `docker service remove web`.

There are a lots of configuration that can be set to run a service. 
```
Alessandros-MBP:~ alessandro$ docker service create --help

Usage:	docker service create [OPTIONS] IMAGE [COMMAND] [ARG...]

Create a new service

Options:
      --config config                      Specify configurations to expose to the service
      --constraint list                    Placement constraints
      --container-label list               Container labels
      --credential-spec credential-spec    Credential spec for managed service account (Windows only)
  -d, --detach                             Exit immediately instead of waiting for the service to converge (default true)
      --dns list                           Set custom DNS servers
      --dns-option list                    Set DNS options
      --dns-search list                    Set custom DNS search domains
      --endpoint-mode string               Endpoint mode (vip or dnsrr) (default "vip")
      --entrypoint command                 Overwrite the default ENTRYPOINT of the image
  -e, --env list                           Set environment variables
      --env-file list                      Read in a file of environment variables
      --group list                         Set one or more supplementary user groups for the container
      --health-cmd string                  Command to run to check health
      --health-interval duration           Time between running the check (ms|s|m|h)
      --health-retries int                 Consecutive failures needed to report unhealthy
      --health-start-period duration       Start period for the container to initialize before counting retries towards unstable (ms|s|m|h)
      --health-timeout duration            Maximum time to allow one check to run (ms|s|m|h)
      --help                               Print usage
      --host list                          Set one or more custom host-to-IP mappings (host:ip)
      --hostname string                    Container hostname
  -l, --label list                         Service labels
      --limit-cpu decimal                  Limit CPUs
      --limit-memory bytes                 Limit Memory
      --log-driver string                  Logging driver for service
      --log-opt list                       Logging driver options
      --mode string                        Service mode (replicated or global) (default "replicated")
      --mount mount                        Attach a filesystem mount to the service
      --name string                        Service name
      --network network                    Network attachments
      --no-healthcheck                     Disable any container-specified HEALTHCHECK
      --no-resolve-image                   Do not query the registry to resolve image digest and supported platforms
      --placement-pref pref                Add a placement preference
  -p, --publish port                       Publish a port as a node port
  -q, --quiet                              Suppress progress output
      --read-only                          Mount the container's root filesystem as read only
      --replicas uint                      Number of tasks
      --reserve-cpu decimal                Reserve CPUs
      --reserve-memory bytes               Reserve Memory
      --restart-condition string           Restart when condition is met ("none"|"on-failure"|"any") (default "any")
      --restart-delay duration             Delay between restart attempts (ns|us|ms|s|m|h) (default 5s)
      --restart-max-attempts uint          Maximum number of restarts before giving up
      --restart-window duration            Window used to evaluate the restart policy (ns|us|ms|s|m|h)
      --rollback-delay duration            Delay between task rollbacks (ns|us|ms|s|m|h) (default 0s)
      --rollback-failure-action string     Action on rollback failure ("pause"|"continue") (default "pause")
      --rollback-max-failure-ratio float   Failure rate to tolerate during a rollback (default 0)
      --rollback-monitor duration          Duration after each task rollback to monitor for failure (ns|us|ms|s|m|h) (default 5s)
      --rollback-order string              Rollback order ("start-first"|"stop-first") (default "stop-first")
      --rollback-parallelism uint          Maximum number of tasks rolled back simultaneously (0 to roll back all at once) (default 1)
      --secret secret                      Specify secrets to expose to the service
      --stop-grace-period duration         Time to wait before force killing a container (ns|us|ms|s|m|h) (default 10s)
      --stop-signal string                 Signal to stop the container
  -t, --tty                                Allocate a pseudo-TTY
      --update-delay duration              Delay between updates (ns|us|ms|s|m|h) (default 0s)
      --update-failure-action string       Action on update failure ("pause"|"continue"|"rollback") (default "pause")
      --update-max-failure-ratio float     Failure rate to tolerate during an update (default 0)
      --update-monitor duration            Duration after each task update to monitor for failure (ns|us|ms|s|m|h) (default 5s)
      --update-order string                Update order ("start-first"|"stop-first") (default "stop-first")
      --update-parallelism uint            Maximum number of tasks updated simultaneously (0 to update all at once) (default 1)
  -u, --user string                        Username or UID (format: <name|uid>[:<group|gid>])
      --with-registry-auth                 Send registry authentication details to swarm agents
  -w, --workdir string                     Working directory inside the container
  ```


## Update
As seen, you can specify how update a service. With `--update-dalay` flag configures the time dalay between updates to a service task or sets of tasks (and can set parallelism actions with `--update-parallelism`). 
If an update succeeds, a new tasks is updated, else, if the update fails, an action can be performed (`pause|continue|rollback`).

## Volumes
You can create two types of mounts for services in a swarm
 - `volume` mounts, or
 - `bind` mounts.
You can configure it using the `--mount` flag on creating phase, or `--mount-add|--mount-rm` on updateing phase.

#### Data Volumes
Data Volumes are storage that remain alive after a container for a task has been removed. The preferred method is to leverage an existing volume:
```
$ docker service create \
  --mount src=<VOLUME-NAME>,dst=<CONTAINER-PATH> \
  --name myservice \
  <IMAGE>
 ```
 You can also create a volume at deployment time, just before starting the container.
 ```
 --mount type=volume,src=<VOLUME-NAME>,dst=<CONTAINER-PATH>,volume-driver=<DRIVER>,volume-opt=<KEY0>=<VALUE0>,volume-opt=<KEY1>=<VALUE1>
 ```

#### Bind Mounts
Bind mounts are file system paths from the host. Docker mounts the path into the container. 
```
docker service create \
  --mount type=bind,src=<HOST-PATH>,dst=<CONTAINER-PATH> \
  --name myservice \
  <IMAGE>
```
Some problems can occur with bind mounts:
 - if you bind mount a host path into a service's container, the path must exist on every swarm node.
 - The Docker swarm mode scheduler may reschedule a running service containers at any time if they became unhealthly or unreachable
 - Host bind mounts are completely non-portable. When you use bind mounts, there is no guarantee that your application will run the same way in developement as it does in production.

# Manage sensitive data with Docker secrets
A _secret_ is a blob of data (such a password, SSH private key, SSl certificate...) that should not be trasmetted over a network or store unencrypted in a Dockerfile or in your application's source code.

When you add a secret to the swarm, Docker sends the secret to the swarm manager over a mutual TLS connecton.
The location of the mount point within the container defaults to `/run/secrets/<secret_name` (Linux containers) or `C:\ProgramData\Docker\secrets` (Windows containers). 


