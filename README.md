This repository for internal training use only.

# 1. Operating System

The backend part of this project is assumed to be running on Ubuntu 14.04 LTS.  

# 2. Database Server

The database product to be used for this project is MySQL 5.7.

We use [skeema](https://github.com/skeema/skeema) for schematic synchronization under `<proj-root>/database/skeema-repo-root/` which intentionally doesn't contain a `.skeema` file. Please read [this tutorial](https://shimo.im/doc/wQ0LvB0rlZcbHF5V) for more information.

With `skeema version 0.2` and `golang version 1.10`, it's tested to be compilable on `Windows10`, but NOT useful due to the failure of trial to communicate via `UNIX socket`.
```
powershell> skeema.exe --version
skeema version 0.2 (beta)

powershell> go version
go version go1.10 windows/amd64
```

You can use [this node module (still under development)](https://github.com/genxium/node-mysqldiff-bridge) instead under `Windows10`, other versions of Windows are not yet tested for compatibility.

The following command(s)
```
### Optional.
user@proj-root/database/skeema-repo-root> cp .skeema.template .skeema

###
user@proj-root/database/skeema-repo-root> skeema diff
```
is recommended to be used for checking difference from your "live MySQL server" to the latest expected schema tracked in git.

## 2.1 Environmental differentiation

Please note that we have 2 candidate live MySQL server configurations `<proj-root>/backend/configs/mysql.conf` and `<proj-root>/backend/configs/mysql.test.conf`, where the latter would only be used if `process.env.TESTING == "true"` for your NodeJs process(es) that runs the server.

# 3. What & How to Install

## 3.1 NodeJs Runtime

Please install `NodeJs 8.x` dependencies by [Ubuntu14InitScripts/backend/node/init](https://github.com/genxium/Ubuntu14InitScripts/tree/master/backend/node).

## 3.2 MySQL 

On a product machine, you can install and manage `MySQL` server by [these scripts](https://github.com/genxium/Ubuntu14InitScripts/tree/master/database/mysql).

## 3.3 Node Modules

Please run

```
proj-root> npm install
proj-root/frontend> npm install
```

to complete the installation.

## 3.4 Required Config Files

Please make sure that the following config files 
```
- <proj-root>/backend/configs/preconfigured.test.sqlite, used by the api-server in non-production modes 
- <proj-root>/backend/configs/preconfigured.sqlite, used by the api-server in production mode 
- <proj-root>/backend/configs/mysql.test.conf, used by the api-server in non-production modes
- <proj-root>/backend/configs/mysql.conf, used by the api-server in production mode
- <proj-root>/backend/configs/redis.test.conf, used by the api-server in non-production modes
- <proj-root>/backend/configs/redis.conf, used by the api-server in production mode
```
exist and are properly set **before starting the api daemon under ANY mode**.

Try

```
proj-root/backend> ./overwrite_configs 
```

or do it manually under `Windows10` (other versions of Windows are not yet tested). 

## 3.5 Redis-server
Launching a redis-server before **before starting the api daemon under ANY mode** is required. You can install and manage `Redis` server by [these scripts](https://github.com/genxium/Ubuntu14InitScripts/tree/master/database/redis).

## 3.7 How to Start & Stop Backend Daemon 

You might have to update the `<proj-root>/backend/configs/*.conf` files to match valid credentials.

It's deliberately made that you need [pm2] installed for starting the necessary backend service of this repository, and you're recommended to have it installed globally on the OS.
```
root@shell> npm install pm2 -g
```

Start the backend service.
```
proj-root> pm2 start backend/server.config.js --only api --env <test | production | stress_test> [--no-daemon]
```

## 3.8 How to Build Frontend Bundle(s)
Unlike the "modes" for backend api daemon, there're by far only 2 modes for a frontend bundle
- development
- production

whilst each could be built with the following CLI procedure(s).

```
proj-root/frontend> npm run build-[development | production]
```


# 4. API Docs 

## 4.1 Generation & Viewer

```
proj-root> npm run docgen
```

It's intentional that `<proj-root>/docs/*` is not commited in to git.

To view the generated docs please follow the instructions below.

```
proj-root> pm2 start backend/server.config.js --only doc [--no-daemon] 
```
# 5. Testing 

TBD.

# 6. Auth Credentials Convension

TBD.

# 7. Directory Structure 

The directory structure is mainly role-based for both backend and frontend.

## 7.1 Backend

TBD.

## 7.2 Frontend

- Frontend codes of each role start with `<proj-root>/frontend/<role>/index.js`, which contains the setup of respective “frontend router”, i.e. react-router, to make use of HTML5 History APIs.
  - It's noticeable that many methods and GUI classes are merely transferred by `<proj-root>/frontend/<role>/index.js` from `<proj-root>/frontend/utils/WebFunc` and `<proj-root>/frontend/widgets/WebGUICommons`. Such an extra layer of abstraction is indended for cross-platform compatibility in the future to probably integrate with react-native.
- The advantage of HTML5 [history.pushState(...)](https://developer.mozilla.org/en-US/docs/Web/API/History_API) is simple for understanding and gorgeous, it makes page transition a local task for the browser. 
    - When transiting `http://same.host.com/path1 => http://same.host.com/path2`, The browser renders the latter locally ~~INSTEAD OF sending "GET http://same.host.com/path2" to backend~~.
    - Now that the top of history stack becomes 
        ```
        http://same.host.com/path2 (top)
        http://same.host.com/path1
        ... (other urls in the history stack)
        ```
        , if browser “refresh” button is triggered now, a request "GET http://same.host.com/path2" would still be sent to backend and it’s the responsibility of “backend router” to proceed accordingly.
- The frontend counterpart of `<proj-root>/backend/RoleLoginCacheCollection` is `<proj-root>/frontend/<role>/<Role>Manager extends AbstractRoleLoginManager`.

# 8. Api-server in "test mode", frontend in "development mode" quick setup

TBD.
