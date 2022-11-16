#!/bin/bash
t_post()
{
  npm run test -- -t 'test router post'
}
t_get ()
{
  npm run test -- -t 'test router get'
}
t_Id ()
{
  npm run test -- -t 'test propId'
}
t_delete()
{
npm run test -- -t 'test router delete'
}
t_update()
{
npm run test -- -t 'test router update'
}
t_dummy()
{
npm run test -- -t 'dummy returns one'
}
t_login()
{
npm run test -- -t 'test router login and users'
}
t_favorite()
{
npm run test -- -t 'Favorite Blog'
}
t_author()
{
npm run test -- -t 'Author up blogs'
}
t_likes()
{
npm run test -- -t 'Most likes'
}
t_total()
{
npm run test -- -t 'Total likes'
}
t_initially()
{
npm run test -- -t 'Test initially one user in db collection users'
}
# Execução dos grupos de testes
t_post; t_get; t_Id; t_delete;# 4 grupos
# t_dummy; t_login; t_favorite; t_update; # 4 grupos
# t_author; t_likes; t_total; t_initially; # 4 grupos
