mainApp.config(['$stateProvider', '$urlRouterProvider', '$ocLazyLoadProvider',
    function($stateProvider, $urlRouterProvider, $ocLazyLoadProvider) {
        $stateProvider
            .state('login', {
                url         : '/login',
                templateUrl : 'templates/partials/login/login.html',
                controller  : 'loginController',
                resolve: {
                    deps: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load([{
                            files: [
                                'assets/js/partials/login/login.js'
                            ]
                        }]);
                    }]
                },
                access: {
                  isFree: true
                },
                data: {
                    bodyClasses: 'login-page'
                }
            })
            .state('verify-login', {
                url         : '/verify-login',
                templateUrl : 'templates/partials/login/verify-login.html',
                controller  : 'verifyLoginController',
                resolve: {
                    deps: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load([{
                            files: [
                                'assets/js/partials/login/verify-login.js'
                            ]
                        }]);
                    }]
                },
                access: {
                  isFree: true
                },
                data: {
                    bodyClasses: 'load-screen'
                }
            })
            .state('forgot', {
                url         : '/forgot',
                templateUrl : 'templates/partials/login/forgot.html',
                controller  : 'forgotController',
                resolve: {
                    deps: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load([{
                            files: [
                                'assets/js/partials/login/forgot.js'
                            ]
                        }]);
                    }]
                },
                access: {
                  isFree: true
                },
                data: {
                    bodyClasses: 'login-page'
                }
            })
            .state('changepass', {
                url         : '/changepass',
                templateUrl : 'templates/partials/login/changepass.html',
                controller  : 'changePassController',
                resolve: {
                    deps: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load([{
                            files: [
                                'assets/js/partials/login/changepass.js'
                            ]
                        }]);
                    }]
                },
                access: {
                  isFree: true
                },
                data: {
                    bodyClasses: 'login-page'
                }
            })
            .state('activeaccount', {
                url         : '/activeaccount',
                templateUrl : 'templates/partials/login/activeaccount.html',
                controller  : 'activeAccountController',
                resolve: {
                    deps: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load([{
                            files: [
                                'assets/js/partials/login/activeaccount.js'
                            ]
                        }]);
                    }]
                },
                access: {
                  isFree: true
                },
                data: {
                    bodyClasses: 'login-page'
                }
            })
            .state('sign-up', {
                url         : '/sign-up',
                templateUrl : 'templates/partials/login/signup.html',
                controller  : 'signUpController',
                resolve: {
                    deps: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load([{
                            files: [
                                'assets/js/partials/login/signup.js'
                            ]
                        }]);
                    }]
                },
                access: {
                  isFree: true
                },
                data: {
                    bodyClasses: 'login-page'
                }
            })
            .state('error-login', {
                url         : '/error-login',
                templateUrl : 'templates/partials/login/error-login.html',
                access: {
                  isFree: true
                }
            })
            .state('redirect-external', {
                url         : '/redirect-external/:page',
                templateUrl : 'templates/partials/login/redirect-external.html',
                controller  : 'redirectExternalController',
                params: {
                    page: null,
                    backurl: null
                },
                resolve: {
                    deps: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load([{
                            files: [
                                'assets/js/partials/login/redirect-external.js'
                            ]
                        }]);
                    }]
                },
                access: {
                  isFree: true
                },
                data: {
                    bodyClasses: 'load-screen'
                }
            })
            .state('panel', {
                url         : '/panel',
                templateUrl : 'templates/partials/panel/panel.html',
                controller  : 'panelController',
                resolve: {
                    deps: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load([{
                            files: [
                                'assets/js/partials/panel/panel.js'
                            ]
                        }]);
                    }]
                }
            })
            .state('setting/profile', {
                url         : '/setting/profile',
                templateUrl : 'templates/partials/setting/profile.html',
                controller  : 'profileController',
                resolve: {
                    deps: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load([{
                            files: [
                                'assets/js/partials/setting/profile.js'
                            ]
                        }]);
                    }]
                }
            })
            .state('setting/account', {
                url         : '/setting/account',
                templateUrl : 'templates/partials/setting/account.html',
                controller  : 'accountController',
                resolve: {
                    deps: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load([{
                            files: [
                                'assets/js/partials/setting/account.js'
                            ]
                        }]);
                    }]
                }
            })
            .state('setting/general', {
                url         : '/setting/general',
                templateUrl : 'templates/partials/setting/general.html',
                controller  : 'generalController',
                resolve: {
                    deps: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load([{
                            files: [
                                'assets/js/partials/setting/general.js'
                            ]
                        }]);
                    }]
                }
            })
            .state('alerts', {
                url         : '/alerts',
                templateUrl : 'templates/partials/alert/alert.html',
                controller  : 'alertController',
                resolve: {
                    deps: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load([{
                            files: [
                                'assets/js/partials/alert/alert.js'
                            ]
                        }]);
                    }]
                }
            })
            .state('contact', {
                url         : '/contact',
                templateUrl : 'templates/partials/contact/contact.html',
                controller  : 'contactController',
                resolve: {
                    deps: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load([{
                            files: [
                                'assets/js/partials/contact/contact.js'
                            ]
                        }]);
                    }]
                }
            })
            .state('categories', {
                url         : '/categories',
                templateUrl : 'templates/partials/categories/categories.html',
                controller  : 'categoriesController',
                resolve: {
                    deps: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load([{
                            files: [
                                'assets/js/partials/categories/categories.js'
                            ]
                        }]);
                    }]
                }
            })
            .state('categories/form', {
                url         : '/categories/form/:action/:id',
                templateUrl : 'templates/partials/categories/category_form.html',
                controller  : 'categoryFormController',
                params: {
                    id: null,
                    action: null
                },
                resolve: {
                    deps: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load([{
                            files: [
                                'assets/js/partials/categories/category_form.js'
                            ]
                        }]);
                    }]
                }
            })
            .state('products', {
                url         : '/products/:menu/:category',
                templateUrl : 'templates/partials/products/products.html',
                controller  : 'productsController',
                params: {
                    menu: '0',
                    category: '0'
                },
                resolve: {
                    deps: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load([{
                            files: [
                                'assets/js/partials/products/products.js'
                            ]
                        }]);
                    }]
                }
            })
            .state('products/form', {
                url         : '/products/form/:action/:menId/:catId/:proId',
                templateUrl : 'templates/partials/products/product_form.html',
                controller  : 'productFormController',
                params: {
                    menId: null,
                    catId: '0',
                    proId: null,
                    action: null
                },
                resolve: {
                    deps: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load([{
                            files: [
                                'assets/js/partials/products/product_form.js'
                            ]
                        }]);
                    }]
                }
            })
            .state('menus', {
                url         : '/menus',
                templateUrl : 'templates/partials/menus/menus.html',
                controller  : 'menusController',
                resolve: {
                    deps: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load([{
                            files: [
                                'assets/js/partials/menus/menus.js'
                            ]
                        }]);
                    }]
                }
            })
            .state('menus/form', {
                url         : '/menus/form/:action/:id',
                templateUrl : 'templates/partials/menus/menu_form.html',
                controller  : 'menuFormController',
                params: {
                    id: null,
                    action: null
                },
                resolve: {
                    deps: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load([{
                            files: [
                                'assets/js/partials/menus/menu_form.js'
                            ]
                        }]);
                    }]
                }
            })
            .state('menus/language', {
                url         : '/menus/language/:id',
                templateUrl : 'templates/partials/menus/language_form.html',
                controller  : 'languageFormController',
                params: {
                    id: null
                },
                resolve: {
                    deps: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load([{
                            files: [
                                'assets/js/partials/menus/language_form.js'
                            ]
                        }]);
                    }]
                }
            })
            .state('code/showqr', {
                url         : '/code/showqr',
                templateUrl : 'templates/partials/code/show_qr.html',
                controller  : 'showQrController',
                resolve: {
                    deps: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load([{
                            files: [
                                'assets/js/partials/code/show_qr.js'
                            ]
                        }]);
                    }]
                }
            })
            .state('code/getqr', {
                url         : '/code/getqr',
                templateUrl : 'templates/partials/code/get_qr.html',
                controller  : 'getQrController',
                resolve: {
                    deps: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load([{
                            files: [
                                'assets/js/partials/code/get_qr.js'
                            ]
                        }]);
                    }]
                }
            })
            .state('code/shipping', {
                url         : '/code/shipping',
                templateUrl : 'templates/partials/code/shipping.html',
                controller  : 'shippingController',
                resolve: {
                    deps: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load([{
                            files: [
                                'assets/js/partials/code/shipping.js'
                            ]
                        }]);
                    }]
                }
            })
            .state('members', {
                url         : '/members',
                templateUrl : 'templates/partials/members/members.html',
                controller  : 'membersController',
                resolve: {
                    deps: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load([{
                            files: [
                                'assets/js/partials/members/members.js'
                            ]
                        }]);
                    }]
                }
            })
            .state('members/form', {
                url         : '/members/form/:action/:id',
                templateUrl : 'templates/partials/members/members_form.html',
                controller  : 'membersFormController',
                params: {
                    id: null,
                    action: null
                },
                resolve: {
                    deps: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load([{
                            files: [
                                'assets/js/partials/members/members_form.js'
                            ]
                        }]);
                    }]
                }
            })
            .state('orders', {
                url         : '/orders',
                templateUrl : 'templates/partials/orders/orders.html',
                controller  : 'ordersController',
                resolve: {
                    deps: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load([{
                            files: [
                                'assets/js/partials/orders/orders.js'
                            ]
                        }]);
                    }]
                }
            })
            .state('forms/N86', {
                url         : '/forms/N86',
                templateUrl : 'templates/partials/forms/N86.html',
                controller  : 'N86Controller',
                resolve: {
                    deps: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load([{
                            files: [
                                'assets/js/partials/forms/N86.js'
                            ]
                        }]);
                    }]
                }
            })
            .state('messages', {
                url         : '/messages',
                templateUrl : 'templates/partials/messages/messages.html',
                controller  : 'messagesController',
                resolve: {
                    deps: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load([{
                            files: [
                                'assets/js/partials/messages/messages.js'
                            ]
                        }]);
                    }]
                }
            })
            .state('messages/form', {
                url         : '/messages/form/:action/:id',
                templateUrl : 'templates/partials/messages/message_form.html',
                controller  : 'messageFormController',
                params: {
                    id: null,
                    action: null
                },
                resolve: {
                    deps: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load([{
                            files: [
                                'assets/js/partials/messages/message_form.js'
                            ]
                        }]);
                    }]
                }
            });

        $urlRouterProvider.otherwise('/verify-login'); //page by default

        $ocLazyLoadProvider.config({
            name: 'mainApp',
            cssFilesInsertBefore: 'ng_load_plugins_before',
            debug: true,
            events: true,
            loadedModules:['MyApp']
        });
    }]);
