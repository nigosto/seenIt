$(() => {
    const app = Sammy('#container', function () {
        this.use('Handlebars', 'hbs');

        this.get('index.html',function () {
            this.loadPartials({
                header: './templates/common/header.hbs',
                footer: './templates/common/footer.hbs',
                login: './templates/forms/login.hbs',
                register: './templates/forms/register.hbs'
            }).then(function () {
                this.partial('./templates/welcome.hbs')
            })
        });

        this.get('home',function () {
            this.loadPartials({
                header: './templates/common/header.hbs',
                footer: './templates/common/footer.hbs',
                login: './templates/forms/login.hbs',
                register: './templates/forms/register.hbs'
            }).then(function () {
                this.partial('./templates/welcome.hbs')
            })
        });
        
        this.post('#/register', function (ctx) {
            let username = ctx.params.username;
            let password = ctx.params.password;
            let repeatPass = ctx.params.repeatPass;

            console.log(username,password,repeatPass);

            if (!/^[A-Za-z]{3,}$/.test(username)) {
                notify.showError('Username should be at least 3 characters long and contain only english alphabet letters');
            } else if (!/^[A-Za-z\d]{6,}$/.test(password)) {
                notify.showError('Password should be at least 6 characters long and contain only english alphabet letters');
            } else if (repeatPass !== password) {
                notify.showError('Passwords must match!');
            } else {
                service.register(username, password);
                notify.showInfo('User registration successful!');
                this.redirect('#/catalog')
            }
        });

        this.post('#/login',((ctx)=> {
            let username = ctx.params.username;
            let password = ctx.params.password;


            if (username === '' || password === '') {
                notify.showError('All fields should be non-empty!');

            } else {
                service.login(username,password)
                    .then((res) => {
                    service.saveAuthInSession(res)
                    notify.showInfo('Login successful!');
                    ctx.redirect('#/catalog')
                }).catch(notify.handleError)

            }

        }));

        this.get('#/logout',function (ctx) {
            service.logout()
            notify.showInfo('Logout successful.')
            this.redirect('#/home')
        })

        this.get('#/catalog', function (ctx) {
            if (!auth.isAuth()) {
                ctx.redirect('#/home');
                return;
            }
            posts.getAllPosts().then(function (res) {
                res.forEach((p, i) => {
                    p.rank = i + 1;
                    p.date = calcTime(p._kmd.ect);
                    p.isAuthor = p._acl.creator === sessionStorage.getItem('id');
                });
                console.log(res)
                ctx.isAuth = auth.isAuth()
                ctx.username = sessionStorage.getItem('username')
                ctx.posts = res

                ctx.loadPartials({
                    header: './templates/common/header.hbs',
                    footer: './templates/common/footer.hbs',
                    menu: './templates/common/menu.hbs',
                    post: './templates/details/post.hbs',
                    postList: './templates/postList.hbs'
                }).then(function () {
                    this.partial('./templates/catalog.hbs')
                })
            }).catch(notify.handleError)

        });

        function calcTime(dateIsoFormat) {
            let diff = new Date - (new Date(dateIsoFormat));
            diff = Math.floor(diff / 60000);
            if (diff < 1) return 'less than a minute';
            if (diff < 60) return diff + ' minute' + pluralize(diff);
            diff = Math.floor(diff / 60);
            if (diff < 24) return diff + ' hour' + pluralize(diff);
            diff = Math.floor(diff / 24);
            if (diff < 30) return diff + ' day' + pluralize(diff);
            diff = Math.floor(diff / 30);
            if (diff < 12) return diff + ' month' + pluralize(diff);
            diff = Math.floor(diff / 12);
            return diff + ' year' + pluralize(diff);
            function pluralize(value) {
                if (value !== 1) return 's';
                else return '';
            }
        }
    });

    app.run()
});