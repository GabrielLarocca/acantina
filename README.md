
# A Cantina

O projeto, que está sendo desenvolvido durante a disciplina de 
Projeto de Software, do curso de Engenharia de Software, busca 
entregar ao cliente um sistema de gerenciamento de pedidos que 
resolva os problemas do negócio.
Consiste em um sistema de duas pontas: para o funcionário, onde 
são gerenciados os pedidos, e para o cliente, onde os mesmo podem
realizar os seus pedidos.

## Rodando o projeto

Na pasta 'backend', execute consecutivamente:
```bash
  npm install
```
```bash
  composer install
```
```bash
  cp .env.example .env
```
Posteriormente, gere a chave laravel através do seguinte comando:
```bash
  php artisan key:generate
```
Altere ainda, no arquivo .env, as informações de DB_USERNAME e 
DB_PASSWORD com as credenciais usadas no acesso do seu banco de 
dados.

Agora, rode o servidor com 
```bash
  php artisan serve
```
Por fim, execute o seguinte comando:
```bash
php artisan db:seed
```
Na pasta 'frontend_admin', no arquivo .env, altere o conteúdo 
de PUBLIC_APP_URL para o local que está rodando seu backend.
Por exemplo: PUBLIC_APP_URL=http://localhost:8000.

Posteriormente, execute os seguintes comandos, consecutivamente:
```bash
  npm install
```
```bash
  npm start
```
Na pasta 'frontend', no arquivo .env, altere o conteúdo 
de PUBLIC_APP_URL para o local que está rodando seu backend.
Por exemplo: PUBLIC_APP_URL=http://localhost:8000.

Posteriormente, execute os seguintes comandos, consecutivamente:
```bash
  npm install
```
```bash
  npm run dev
```
Para realizar o login no painel do funcionário (admin), as
credenciais que devem ser usadas são:
Usuário: admin@admin.com
Senha: 123456