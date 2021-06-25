<template>
    <section class="menuu">
        <div class="openMenu">
            <!--satrt top menu-->
            <div class="topMenu">
                <svg class="back" xmlns="http://www.w3.org/2000/svg" width="259" height="342" viewBox="0 0 259 342">
                    <g id="Group_1127" data-name="Group 1127" transform="translate(0 0)">
                      <path id="Path_1296" data-name="Path 1296" d="M259-30.109l-3.05,3.75c-20,27-45,7-51-7s-33.741-50.443-85-9C81.483-11.258,25.842-32.579,0-39.912V-327.327H259Z" transform="translate(0 327.327)" fill="#005eaf" fill-rule="evenodd"></path>
                      <path id="Path_1297" data-name="Path 1297" d="M0-30.109l3.05,3.75c20,27,45,7,51-7s33.741-50.443,85-9c38.467,31.1,94.108,9.78,119.95,2.448V-327.327H0Z" transform="translate(0 355)" fill="#005eaf" fill-rule="evenodd" opacity="0.33"></path>
                    </g>
                </svg>                  
                <img class="borderr" src="~assets/img/top border.png" alt="">
                <div class="closes" @click="changeMenuState" style="cursor: pointer">
                    <svg xmlns="http://www.w3.org/2000/svg" width="58.531" height="52.599" viewBox="0 0 58.531 52.599">
                        <path id="Path_460" data-name="Path 460" d="M6.469-76.367v52.6c3.919-3.026,9.694-5.583,18.079-5.767a32.977,32.977,0,0,1,9.241,1.055,22.987,22.987,0,0,0,5.749.732h2.985A22.476,22.476,0,0,0,65-50.225v0A22.476,22.476,0,0,0,42.524-72.7H39.539a22.5,22.5,0,0,0-5.825.762,33.514,33.514,0,0,1-9.889,1.109C18.224-71.055,11.449-72.306,6.469-76.367Z" transform="translate(-6.469 76.367)" fill="#104982" fill-rule="evenodd"></path>
                    </svg> 
                    <div class="icon">
                        <img src="~assets/img/closee.png" alt="">
                    </div>                    
                </div>
                <div class="lang">
                    <!-- <img src="~assets/img/ar.png" alt=""> -->
                    <q-toggle v-model="_isEnglish" icon="language"/>
                </div> 
                <div class="profile">
                    <img src="~assets/img/user(4).png" alt="">
                    <h3 v-if="$_.get(user,'[fullName]')" >{{$_.get(user,'[fullName]')}}</h3>
                    <h3 v-else>{{$_.get(user,'[email]')}}</h3>
                </div>
                <div class="account" v-if="!token">
                    <div class="sign">
                        <a @click="GO_TO_SIGNUP_PAGE" style="cursor: pointer">
                            <h3><img src="~assets/img/sign.png" alt="">{{$t('إنشاء حساب')}}</h3>
                        </a>
                    </div>
                    <div class="login">
                        <a @click="GO_TO_LOGIN_PAGE" style="cursor: pointer">
                            <img src="~assets/img/login.png" alt="">
                            <h3>{{$t('دخول')}}</h3>
                        </a>
                    </div>
                </div>
            </div>
            <!--satrt Link Button-->
            <div class="butgro side-nav" id="butgro" style="margin-top: 1rem;">
                <a class="but side-nav__item side-nav__item--active" data-link="HOME" @click="GO_TO_HOME_PAGE($event)">
                    <img src="~assets/img/bordText.png" alt="">
                    <h3>{{$t('الرئيسية')}}</h3>
                </a>
                <a class="but side-nav__item" data-link="COURSES" @click="GOT_TO_COURSES_PAGE($event)">
                    <img src="~assets/img/bordText.png" alt="">
                    <h3>{{$t('الــدورات')}}</h3>
                </a>
                <a class="but side-nav__item" data-link="BORD" v-if="token" @click="GO_TO_MY_COURSES_PAGE($event)">
                    <img src="~assets/img/bordText.png" alt="">
                    <h3>{{$t('لوحتي التعليمية')}}</h3>
                </a>
                <a class="but side-nav__item" data-link="NOTIFICATION" v-if="token" @click="GO_TO_MY_NOTIFICATIONS_PAGE($event)">
                    <img src="~assets/img/bordText.png" alt="">
                    <h3>{{$t('الإشعارت')}}</h3>
                </a>
                <a class="but side-nav__item" data-link="PROFILE" v-if="token" @click="GO_TO_MY_PROFILE_PAGE($event)">
                    <img src="~assets/img/bordText.png" alt="">
                    <h3>{{$t('الملف الشخصي')}}</h3>
                </a>
            </div>
            <div class="exit" v-if="token" @click="logTheUserOut" style="cursor: pointer">
                <div class="mag">
                    <img src="~assets/img/enter.png" alt="">
                </div>
                <h3 class="q-mr-sm">{{$t('خــروج')}}</h3>
            </div>
        </div>
    </section>
</template>

<script>

import { mapActions, mapGetters, mapState } from "vuex";
import { LocalStorage } from 'quasar'

export default {
    name: "Menu",

    data () {
        return {
        }
    },

    computed: {
        ...mapGetters("authentication", ["token", "user"]),
        ...mapState("settings", ["isEnglish"]),
        _isEnglish: {
            get () {
                return this.isEnglish
            },
            set (newVlaue) {
                return this.setIsEnglishAction(newVlaue)
            }
        }
    },

    mounted () {
        let nav_items = this.$jquery(".side-nav__item");
        let link_attr = JSON.parse(LocalStorage.getItem('activeNav')) || ''
        
        if (link_attr) {
            for (let nav of nav_items) {
                nav = this.$jquery(nav)
                nav.removeClass('side-nav__item--active')
            }
            let active_link = this.$jquery(`[data-link="${link_attr}"]`)
            active_link.addClass('side-nav__item--active')

        }

        nav_items.map(i => {
            let nav = this.$jquery(nav_items[i])
            nav.on('click', () => {

                for (let n of nav_items) {
                    n = this.$jquery(n)
                    n.removeClass('side-nav__item--active')
                }

                nav.addClass('side-nav__item--active')
            })

        })
        
        for (let nav of nav_items) {
        }

        if (!this.$_.isEmpty(this.token)) {
            this.$jquery('#butgro').css({
                'margin-top': '5rem'
            })
        } else {
            this.$jquery('#butgro').css({
                'margin-top': '0'
            })
        }

        if (this.isEnglish) {

            this.$jquery('.closes > svg').css({
                'transform': 'rotate(180deg)'
            })
            
        } else {
            this.$jquery('.closes > svg').css({
                'transform': 'rotate(360deg)'
            })
        }
    },

    watch: {
        token (value) {
            if (!this.$_.isEmpty(value)) {
                this.$jquery('#butgro').css({
                    'margin-top': '5rem'
                })
            } else {
                this.$jquery('#butgro').css({
                    'margin-top': '0'
                })
            }
        },

        async _isEnglish (value) {
            if (value) {
                this.setIsEnglishAction(value)

                this.$jquery('.closes > svg').css({
                    'transform': 'rotate(180deg)'
                })
                
            } else {
                this.$jquery('.closes > svg').css({
                    'transform': 'rotate(360deg)'
                })
                this.setIsEnglishAction(value)
            }
        }
    },

    methods: {
        ...mapActions('authentication', ['logOutAction']),
        ...mapActions('settings', ['setIsEnglishAction', 'setOpenMenuAction', 'setActiveNavAction']),

        MAKE_ACTIVE (e) {
            let active_nav = this.$jquery(e.target).parent().closest('a')
            if (active_nav.length == 0) {
                active_nav = this.$jquery(e.target).closest('a')
            }
            //TODO: Save the active link so when render it will be make active again
            this.setActiveNavAction(active_nav.attr('data-link'))
        },

        changeMenuState () {
            this.setOpenMenuAction(false)
        },

        logTheUserOut() {
            this.logOutAction();
        },

        GO_TO_MY_NOTIFICATIONS_PAGE(e) {
            this.MAKE_ACTIVE(e)
            this.$router.push({ name: "notification" });
        },

        GO_TO_MY_PROFILE_PAGE(e) {
            this.MAKE_ACTIVE(e)
            this.$router.push({ name: "user-profile" });
        },

        GO_TO_MY_COURSES_PAGE(e) {
            this.MAKE_ACTIVE(e)
            this.$router.push({ name: "my-courses" });
        },

        GOT_TO_COURSES_PAGE(e) {
            this.MAKE_ACTIVE(e)
            this.$router.push({ name: "courses" });
        },

        GO_TO_HOME_PAGE(e) {
            this.MAKE_ACTIVE(e)
            this.$router.push({ name: "Home" });
        },

        GO_TO_SIGNUP_PAGE() {
            this.$router.push({ name: "signUp" });
        },

        GO_TO_LOGIN_PAGE() {
            this.$router.push({ name: "login" });
        }
    }
};
</script>
<style lang="scss">
@import "src/css/helpers/_mixins.scss";
@import "src/css/helpers/_variabels.scss";
////////////////////////////////////
///Sid Navigation
.side-nav {
    list-style: none;
    font-size: 1.4rem;
    // font-weight: 300;
    margin-top: 3.5rem;
    display: flex;
    flex-direction: column;

    &__item {
        position: relative;
        
        & > h3 {
            transition: transform 0.2s,
                    width 0.4s cubic-bezier(1,0,0,1) 0.2s;
        }

        &:not(:last-child) {
            margin-bottom: 0.5rem;
        }
    }
 
    &__item::before {
        content: "";
        position: absolute;
        bottom: 50%;
        left: 0;
        width: 3px;
        height: 10%;
        background-color: $color-secondary-light;
        transform: scaleY(0);
        transition: transform 0.2s,
                    width 0.4s cubic-bezier(1,0,0,1) 0.2s,
                    background-color 0.1s
                    ; 
    }
    
    &__item:hover::before ,
    &__item--active::before {
        transform: scaleY(1);
        width: 15%;
    }


    &__item:active::before {
        background-color: $color-secondary-light;
    }

    &__item:hover > h3 {
        transform: translateX(-1rem);
    }

    &__link:link,
    &__link:visited {
        text-decoration: none;
        color: $color-grey-light-1;
        background-color: $color-secondary-light;
        text-transform: uppercase;
        display: block;
        padding:  1.5rem 3rem;
        position: relative;
        z-index: 10;
        display: flex;
        align-items: center;
    }

    &__icon {
        width: 1.75rem;
        height: 1.75rem;
        margin-right: 2rem;
        fill: currentColor; // The color of the current element or the parent
    }
}

/*--- START menu ---*/
.menuu{
    position: fixed;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    right: 0;
    z-index: 100;
    .openMenu{
        max-width: 259px;
        height: 100%;
        background-color: #0C7AD8;
        border-radius: 0;
        position: relative;
        transition: all 0.2s ease-in;
        box-shadow: 2px 9px 18.79px 2.21px #54545477;
        .closee{
            position: absolute;
            top: 12px;
            left: 0;
            right: 15px;
            cursor: pointer;
            background-color: #efefef;
            width: 31px;
            text-align: center;
            height: 30px;
            border-radius: 50%;
            line-height: 1.7;
        }
        .topMenu{
            position: relative;
            .back{
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
            }
            .borderr{
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                margin: 0 auto;
            }
            .closes{
                position: relative;
                z-index: 5;
                svg{
                    position: absolute;
                    top: 19px;
                    left: 0;
                    width: auto;
                }
                .icon{
                    width: 32px;
                    height: 32px;
                    background-color: #0E5CA4;
                    border-radius: 50%;
                    text-align: center;
                    cursor: pointer;
                    line-height: 1.9;
                    position: absolute;
                    top: 29px;
                    left: 21px;
                    img{
                        width: auto;
                    }
                }
            }
            .lang{
                position: relative;
                top: 32px;
                right: 6px;
                left: 0;
                cursor: pointer;
                z-index: 5;
                width: 33px;
                img{
                    width: auto;
                }
            }
            .profile{
                position: relative;
                text-align: center;
                padding: 0 0 7px 0;
                margin: -12px 0 0 0;
                h3{
                    font-size: 15px;
                    font-family: 'cairoR';
                    color: #fff;
                    margin: 10px 0 10px 0;
                }
            }
            .account{
                position: relative;
                text-align: center;
                margin: 5px auto 0 auto;
                width: 139px;
                .sign{
                    height: 41px;
                    width: 137px;
                    color: #fff;
                    background-color: #1C508D;
                    border-radius: 50px;
                    padding: 8px 16px;
                    text-align: center;
                    margin: 0 0 7px 0;
                    overflow: hidden;
                    a{
                        text-decoration: none;
                        font-size: 16px;
                        color: #fff;
                        h3{
                            display: inline-block;
                            font-size: 14px;
                            font-family: 'cairoR';
                        }
                    }
                }
                .login{
                    height: 41px;
                    width: 137px;
                    color: #926D05;
                    background-color: #FCC74C;
                    border-radius: 50px;
                    padding: 7px 15px;
                    text-align: center;
                    overflow: hidden;
                    a{
                        text-decoration: none;
                        font-size: 16px;
                        color: #926D05;
                    }
                    h3{
                        display: inline-block;
                        font-size: 16px;
                        font-family: 'cairoR';
                    }
                }
            }
        }
        .butgro{
            padding: 118px 0 30px 0;
            .but{
                margin: 0 0 10px 0;
                padding: 0 0 4px 0;
                cursor: pointer;
                transition: all 0.2s ease-in;
                img{
                    display: inline-block;
                    margin-left: 10px;
                }
                h3{
                    display: inline-block;
                    font-size: 15px;
                    font-family: 'cairoR';
                    color: #fcfcfc;
                }
            }
        }
        .exit{
            height: 41px;
            width: 137px;
            color: #fff;
            background-color: #1C508D;
            border-radius: 50px;
            padding: 8px 16px;
            text-align: center;
            margin:0 auto 26px auto;
            overflow: hidden;
            .mag{
                background: #E57E6D;
                padding: 4px;
                border-radius: 50%;
                display: inline-block;
                width: 32px;
                height: 32px;
                line-height: 1.2;
                margin: -3px 0 0 0;
                
            }
            h3{
                display: inline-block;
                font-size: 16px;
                font-family: 'cairoR';
            }
        }
    }
}
/*--- End menu ---*/
</style>
