---
layout: post
title:  "An introduction to Docker Swarm, with example"
date:   2017-12-5
excerpt: "A Docker-native clustering system."
tag:
- english
- docker
feature: https://communities.bmc.com/servlet/JiveServlet/showImage/102-46538-4-232915/Docker+Swarm+v2.png
comments: true
---
_Those are a personal notes about Docker Swarm, derivated by Documentation. After those there is an example._

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

# Let's play!!!
Let's try Docker Swarm. We are going to create a single, usual container on Docker Engine, with Apache Webserver (`httpd` Docker image), and try to saturate it with `slowhttptest` tool. After that, we are going to create a Docker Swarm Service and try to see if the network is able to resist to `slowhttptest` with same amount of request.

### Docker standard container
We deploy us service, starting a container with the following command:
```
docker run --rm -it --name web -p 8080:80 -v web:/usr/local/apache2/htdocs/ httpd:latest
```
(Some problems may occur on MacOS while trying to mount a volume in this way. Try to insert absolute path to `web` directory instead of relative path).

Now check that all works going on `http://localhost:8080` with your favourite browser.
You should see something like this
[It works!]({{ site.url }}/assets/img/post-image/works.png)

Now try to make the webserver unavaiable using `ab` (Apache Benchmark).
You can run `ab` with... Docker container! Let's write:
```
time docker run --net=host --rm jordi/ab ab -c 10000 -n 30000 -r http://localhost:8080/
```
to measure time needed to complete 30000 connections to webserver, with 10000 connections performed simultaneously
and without closing the socket in the case of erro (`-r` flag).

My output is
```
This is ApacheBench, Version 2.3 <$Revision: 1796539 $>
Copyright 1996 Adam Twiss, Zeus Technology Ltd, http://www.zeustech.net/
Licensed to The Apache Software Foundation, http://www.apache.org/

Benchmarking localhost (be patient)
Completed 3000 requests
Completed 6000 requests
Completed 9000 requests
Completed 12000 requests
Completed 15000 requests
Completed 18000 requests
Completed 21000 requests
Completed 24000 requests
Completed 27000 requests
apr_pollset_poll: The timeout specified has expired (70007)
Total of 29452 requests completed

real  1m35.783s
user  0m0.017s
sys 0m0.017s
```

Now try to build a distributed service that execute this webserver with 6 tasks and see how many times does it needed to complete 30000 connections.

### Docker Swarm Mode
##### Create 4 Nodes
To create 4 nodes on the same machine, we are going to use `docker-machine` with the following command:
```docker-machine create --driver virtualbox worker1```
And do this for four times, or:
```
for i in `seq 1 4`; 
do 
  docker-machine create --driver virtualbox worker$i; 
done
```
Now we have 4 workers, you can see those with `docker-machine ls`.
If all is gone correctly, your output should be similar to this:
```
Alessandros-MBP:web alessandro$ docker-machine ls
NAME      ACTIVE   DRIVER       STATE     URL                         SWARM   DOCKER        ERRORS
worker1   -        virtualbox   Running   tcp://192.168.99.100:2376           v17.11.0-ce   
worker2   -        virtualbox   Running   tcp://192.168.99.101:2376           v17.11.0-ce   
worker3   -        virtualbox   Running   tcp://192.168.99.102:2376           v17.11.0-ce   
worker4   -        virtualbox   Running   tcp://192.168.99.103:2376           v17.11.0-ce   
```

##### Create a manager
Now that we have created 4 workers, let's do create a Swarm Manager.
```
docker-machine create manager1
```
and then, get the `manager1` IP address, typing `docker-machine ls` and reading the URL field for `manager1`.

Connect now to `manager1` with 
```
docker-machine ssh manager1
```
and then start a new swarm, so run inside `manager1`:
```
docker swarm init --advertise-addr <MANAGER-IP>
```
in my case, `<MANAGER-IP>` is `192.168.99.104`.

##### Join the workers to the swarm
This initialization create a token, that you have to use to join from workers.
```
docker@manager1:~$ docker swarm init --advertise-addr 192.168.99.104
Swarm initialized: current node (ghip4g5s8l1qaj19u9bt4z1g5) is now a manager.

To add a worker to this swarm, run the following command:

    docker swarm join --token SWMTKN-1-5vkvrcb97hwf7lnd8bwdwoz86n9roqh594aj34unp8ephtj7wb-c6vyjcedx7qsj0zvxxaje7zz7 192.168.99.104:2377

To add a manager to this swarm, run 'docker swarm join-token manager' and follow the instructions.
```
So get the command `docker swarm join --token ... <MANAGER-IP>:<PORT` and paste it into each worker connecting to it via `docker-machine ssh`.

You can perform this operation typing 
```
for i in `seq 1 4`; 
do 
  docker-machine ssh worker$i docker swarm join --token ... <MANAGER-IP>:<PORT`;
done
```
Now we have the swarm created.

Reconnect via `docker-machine ssh` to `manager1` to configure the service, then execute `docker node ls` to see all the worker joined to the swarm.
```
docker@manager1:~$ docker node ls
ID                            HOSTNAME            STATUS              AVAILABILITY        MANAGER STATUS
ghip4g5s8l1qaj19u9bt4z1g5 *   manager1            Ready               Active              Leader
rarxfvelnw1sl6kxll2hvum7z     worker1             Ready               Active              
64rcnb9unhkrkx15gk43tld5b     worker2             Ready               Active              
oerktjryawqzadakuwnjnka3l     worker3             Ready               Active              
whq7kd3zkld9jlg7vgbi307uj     worker4             Ready               Active         
```

Now start a service, with 5 tasks and mounting a "/web" volume with:
```
docker service create --replicas 5 -p 80:80 --name web httpd
```
Now you can see the service progress with
```
$ docker service ps web
ID                  NAME                IMAGE               NODE                DESIRED STATE       CURRENT STATE           ERROR               PORTS
vsyi9ywzy1xc        web.1               httpd:latest        worker1             Running             Running 3 minutes ago                       
cbs958bkwx3f        web.2               httpd:latest        worker2             Running             Running 2 minutes ago                       
thalirehjpfa        web.3               httpd:latest        worker3             Running             Running 3 minutes ago                       
shrtupjr4bjy        web.4               httpd:latest        worker4             Running             Running 2 minutes ago                       
ttz7c79ogk8r        web.5               httpd:latest        manager1            Running             Running 3 minutes ago   
```

Now reperform the Benchmark and see the result:
```
docker@manager1:~$ time docker run --net=host --rm jordi/ab ab -c 10000 -n 30000 -r http://localhost:80/
This is ApacheBench, Version 2.3 <$Revision: 1796539 $>
Copyright 1996 Adam Twiss, Zeus Technology Ltd, http://www.zeustech.net/
Licensed to The Apache Software Foundation, http://www.apache.org/

Benchmarking localhost (be patient)
Completed 3000 requests
Completed 6000 requests
apr_pollset_poll: The timeout specified has expired (70007)
Total of 8124 requests completed
Command exited with non-zero status 119
real  0m 40.90s
user  0m 0.01s
sys 0m 0.00s
```
