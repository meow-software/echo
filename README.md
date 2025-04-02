### Redis && Redis-Insight
Redis est exposé sur 0.0.0.0:6379, donc tu devrais pouvoir y accéder:
- Depuis l'hote
```shell
redis://:root@127.0.0.1:6379
```
- Depuis un des containers
```shell
redis://:root@redis:6379
```