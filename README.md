
# **Kubernetes-NodeJs-MySQL**
This repository contains demo application for the Kubernetes & DevOps Advanced workshop.
It contains multi-tier architecture on Kubernetes which involves one microservice and a database.

*Database Tier*
The MYSQL database has one table 'employee' under Organization database with some records. 

*Service API Tier*
This tier is exposing a node api and when this API is invoked, it will communicate with Database and fetch the records from the table.

[DockerImageurl](https://hub.docker.com/layers/ayushi1610/webapi/v5/images/sha256-9f7e9e59ca468f6b998d764580c2da8ed72edb10b363d254cb115d6e18137364?context=explore)

## **Overall Flow**

### **Web API**
This is node.js based application which is connecting with MYSQL2 to read table records. It is reading datbase configuration from environment variables. 

For password, Kubernetes Secrets has been used. An image has been created for this application with the help of Dockerfile and published that image to docker hub.

#### **To create Image** ####
1. docker build -t nodeemployee .
2. docker tag nodeemployee ayushi1610/webapi:v5
3. docker push ayushi1610/webapi:v5
4. [DockerImageUrl](https://hub.docker.com/layers/ayushi1610/webapi/v5/images/sha256-9f7e9e59ca468f6b998d764580c2da8ed72edb10b363d254cb115d6e18137364?context=explore)

It is running on 4 pods using Rolling Update deployment and LoadBalancer has been used for connectivity from outside of the Kubernetes cluster.
1. [nodeapi_deployment.yaml](https://github.com/ayushijain16/Kubernetes-NodeJS-MySQL/blob/code/nodeapi_deployment.yaml) - Deployment file
2. [nodeapi_lbservice.yaml](https://github.com/ayushijain16/Kubernetes-NodeJS-MySQL/blob/code/nodeapi_lbservice.yaml) - Load Balancer Service file
3. [Dockerfile](https://github.com/ayushijain16/Kubernetes-NodeJS-MySQL/blob/code/Dockerfile) - For image creation
4. [src](https://github.com/ayushijain16/Kubernetes-NodeJS-MySQL/tree/code/src) - node.js code 

### **Database**
MySQL database is running on single pod using recreate deployment and ClusterIP has been used to connect internally with api. For Persistent Storage GCEPersistentDisk has been used.

Initial table creation with records has been done using configmap file.
1. DatabaseName - Organization
2. TableName - employee
3. [mysqldb_configmap.yaml](https://github.com/ayushijain16/Kubernetes-NodeJS-MySQL/blob/code/mysqldb_configmap.yaml) - Create database
4. [mysqldb_persistentvolumes.yaml](https://github.com/ayushijain16/Kubernetes-NodeJS-MySQL/blob/code/mysqldb_persistentvolumes.yaml) - Persistent Volume
5. [mysqldb_persistentvolumeclaim.yaml](https://github.com/ayushijain16/Kubernetes-NodeJS-MySQL/blob/code/mysqldb_persistentvolumeclaim.yaml) - Persistent Volume Claim
6. [mysqldb_deployment.yaml](https://github.com/ayushijain16/Kubernetes-NodeJS-MySQL/blob/code/mysqldb_deployment.yaml) - Deployment file
7. [mysqldb_clusterservice.yaml](https://github.com/ayushijain16/Kubernetes-NodeJS-MySQL/blob/code/mysqldb_clusterservice.yaml)- Cluster IP Service file


### **Steps for Database Setup**

1. Create Cluster.
2. Connect to Cluster and upload all yaml files.
3. Run to create root user secret
   
   kubectl create secret generic mysql-root-user --from-literal=password=<password-value>

4. Create db-pd gcePersistentDisk manually.
5. Deploy all database yaml files in above mentioned order using kubectl apply -f <file-name> command.
6. Run below commands to create Test User

   kubectl exec -it pod-name -- /bin/bash

   mysql -u <root-user> -p

   Enter password

   CREATE USER 'TEST'@'%' IDENTIFIED BY '<Test-user-Password>';

   GRANT ALL PRIVILEGES ON Organization.* TO 'TEST'@'%';

   FLUSH PRIVILEGES;

7. Now check if database is accessible using below commands.
   
   kubectl exec -it mysql-pod-f8979574d-f5qsj -- /bin/bash

   mysql -u root -p

   select * from Organization.employee;

8. Test database user kubernetes secret create:
   
   kubectl create secret generic mysql-pass --from-literal=password=<password-value>

### **Steps for API Setup**
1. Deploy all api yaml files in above mentioned order using kubectl apply -f <file-name> command.
2. Hit the External IP in browser and check database records are accessible.
   
### **Deployed API URL**

API URL : [GetEmployees](http://34.133.174.202:3000/)
