(()=>{"use strict";var e={801:function(e,t,o){var n=this&&this.__awaiter||function(e,t,o,n){return new(o||(o=Promise))((function(r,i){function s(e){try{u(n.next(e))}catch(e){i(e)}}function a(e){try{u(n.throw(e))}catch(e){i(e)}}function u(e){var t;e.done?r(e.value):(t=e.value,t instanceof o?t:new o((function(e){e(t)}))).then(s,a)}u((n=n.apply(e,t||[])).next())}))},r=this&&this.__importDefault||function(e){return e&&e.__esModule?e:{default:e}};Object.defineProperty(t,"__esModule",{value:!0});const i=r(o(931));t.default={login:(e,t,o)=>n(void 0,void 0,void 0,(function*(){var n,r;try{const o=null===(n=e.query.rm_path)||void 0===n?void 0:n.toString(),i=null===(r=e.query.rm_name)||void 0===r?void 0:r.toString(),s=i&&o?`/auth?rm_name=${i}&rm_path=${o}`:"/auth";t.oidc.login({returnTo:s,silent:!0})}catch(e){o(e)}})),logout:(e,t,o)=>n(void 0,void 0,void 0,(function*(){try{if(!e.oidc.isAuthenticated())throw new i.default.Unauthorized("Not logged in");t.oidc.logout({returnTo:"https://www.resumemango.com"}),t.clearCookie("rm_ia",{path:"/",domain:".resumemango.com"})}catch(e){o(e)}}))}},443:function(e,t,o){var n=this&&this.__awaiter||function(e,t,o,n){return new(o||(o=Promise))((function(r,i){function s(e){try{u(n.next(e))}catch(e){i(e)}}function a(e){try{u(n.throw(e))}catch(e){i(e)}}function u(e){var t;e.done?r(e.value):(t=e.value,t instanceof o?t:new o((function(e){e(t)}))).then(s,a)}u((n=n.apply(e,t||[])).next())}))},r=this&&this.__importDefault||function(e){return e&&e.__esModule?e:{default:e}};Object.defineProperty(t,"__esModule",{value:!0});const i=r(o(931)),s=o(219),a=o(922);t.default={home:(e,t,o)=>n(void 0,void 0,void 0,(function*(){var n,r,i;try{let o,u="https://www.resumemango.com";const c=null===(n=e.query.rm_path)||void 0===n?void 0:n.toString(),l=null===(r=e.query.rm_name)||void 0===r?void 0:r.toString(),d=null===(i=e.oidc.accessToken)||void 0===i?void 0:i.access_token,{SID:f}=e.cookies;f&&(yield(0,a.syncToken)(d,f)),c&&l&&(o=s.IN_PROD?"app"===l?"https://app.resumemango.com":"manage"===l?"https://manage.resumemango.com":"https://www.resumemango.com":"app"===l?"http://localhost:3001":"manage"===l?"http://localhost:3002":"http://localhost:3000",u=o+c),t.redirect(u)}catch(e){o(e)}})),initialData:(e,t,o)=>n(void 0,void 0,void 0,(function*(){var n;try{const{SID:o}=e.cookies;if(!e.oidc.isAuthenticated())throw new i.default.Unauthorized;const{token_type:r,isExpired:s,refresh:u}=e.oidc.accessToken,c=e.oidc.user;if(!c)throw new i.default.Unauthorized("user not found!");const l=(0,a.parseUser)(c);let d=null===(n=e.oidc.accessToken)||void 0===n?void 0:n.access_token;if(s()){const{access_token:e}=yield u();d=e}if(!d||!r)throw new i.default.Unauthorized;if(!l.ref){const e=yield(0,a.updateUserRef)(d,u,o);e&&(d=null==e?void 0:e.access_token,l.ref=e.ref)}t.status(200),t.json({user:l,token:`${r} ${d}`})}catch(e){o(e)}})),refreshSession:(e,t,o)=>n(void 0,void 0,void 0,(function*(){try{if(!e.oidc.isAuthenticated())throw new i.default.Unauthorized;const{token_type:o,refresh:n}=e.oidc.accessToken,{access_token:r}=yield n();if(!r)throw(0,i.default)(400,"failed to refresh session!");console.log("refreshed"),t.status(200),t.json(`${o} ${r}`)}catch(e){o(e)}}))}},82:function(e,t,o){var n=this&&this.__awaiter||function(e,t,o,n){return new(o||(o=Promise))((function(r,i){function s(e){try{u(n.next(e))}catch(e){i(e)}}function a(e){try{u(n.throw(e))}catch(e){i(e)}}function u(e){var t;e.done?r(e.value):(t=e.value,t instanceof o?t:new o((function(e){e(t)}))).then(s,a)}u((n=n.apply(e,t||[])).next())}))},r=this&&this.__importDefault||function(e){return e&&e.__esModule?e:{default:e}};Object.defineProperty(t,"__esModule",{value:!0});const i=r(o(931));t.default={token:(e,t,o)=>n(void 0,void 0,void 0,(function*(){var n;try{if(!e.oidc.isAuthenticated())throw new i.default.Unauthorized;const{token_type:o,isExpired:r,refresh:s}=e.oidc.accessToken;let a=null===(n=e.oidc.accessToken)||void 0===n?void 0:n.access_token;if(r()){const{access_token:e}=yield s();a=e}if(!a||!o)throw new i.default.Unauthorized;t.status(200),t.json({token_type:o,token:a})}catch(e){o(e)}}))}},922:function(e,t,o){var n=this&&this.__awaiter||function(e,t,o,n){return new(o||(o=Promise))((function(r,i){function s(e){try{u(n.next(e))}catch(e){i(e)}}function a(e){try{u(n.throw(e))}catch(e){i(e)}}function u(e){var t;e.done?r(e.value):(t=e.value,t instanceof o?t:new o((function(e){e(t)}))).then(s,a)}u((n=n.apply(e,t||[])).next())}))},r=this&&this.__importDefault||function(e){return e&&e.__esModule?e:{default:e}};Object.defineProperty(t,"__esModule",{value:!0}),t.updateUserRef=t.syncToken=t.parseUser=void 0;const i=r(o(167));t.parseUser=e=>{let t="",o="";const n="https://www.resumemango.com",r=e&&e[n].user_metadata,i=e&&e[n].app_metadata,s=e&&e[n].role||null;return r&&r.firstName?(t=r.firstName,o=r.lastName):"auth0"===e.sub.split("|")[0]?t=e.nickname:(t=e.given_name,o=e.family_name),{role:s,firstName:t,lastName:o,ref:i.ref||""}},t.syncToken=(e,t)=>n(void 0,void 0,void 0,(function*(){return yield i.default.request({method:"PATCH",url:"https://api.resumemango.com/v1/m2m/user/sid",headers:{"Content-Type":"application/json",Authorization:`Bearer ${e}`,Cookie:`SID=${t};`},withCredentials:!0}).then((e=>n(void 0,void 0,void 0,(function*(){return console.log("synced"),!0})))).catch((e=>(console.log("failed to sync session ID!"),!1)))})),t.updateUserRef=(e,t,o)=>n(void 0,void 0,void 0,(function*(){return yield i.default.request({method:"POST",url:"https://api.resumemango.com/v1/m2m/user",headers:{"Content-Type":"application/json",Authorization:`Bearer ${e}`,Cookie:`SID=${o};`},withCredentials:!0}).then((e=>n(void 0,void 0,void 0,(function*(){const{access_token:o}=yield t();return{access_token:o,ref:e.data}})))).catch((e=>(console.log(e.response&&e.response.data&&e.response.data.message?e.response.data.message:e),null)))}))},653:function(e,t,o){var n=this&&this.__awaiter||function(e,t,o,n){return new(o||(o=Promise))((function(r,i){function s(e){try{u(n.next(e))}catch(e){i(e)}}function a(e){try{u(n.throw(e))}catch(e){i(e)}}function u(e){var t;e.done?r(e.value):(t=e.value,t instanceof o?t:new o((function(e){e(t)}))).then(s,a)}u((n=n.apply(e,t||[])).next())}))};Object.defineProperty(t,"__esModule",{value:!0}),t.errorHandler=t.notFound=void 0;const r=o(219);t.notFound=(e,t,o)=>n(void 0,void 0,void 0,(function*(){const e=new Error("Not Found");e.status=404,o(e)})),t.errorHandler=(e,t,o,n)=>{console.log(e.stack);const{retry:i}=t.query;return i||400!==e.status||!e.message.includes("checks.state argument is missing")&&!e.message.includes("state mismatch")?401===e.status&&e.message.includes("Not logged in")?o.redirect("https://www.resumemango.com"):(o.status(e.status||500),o.send({error:{status:e.status||500,message:e.message||"Something went wrong",stack:r.IN_PROD?null:e.stack}})):(console.log("redirect for check state error"),o.redirect("/auth?retry=1"))}},616:function(e,t,o){var n=this&&this.__importDefault||function(e){return e&&e.__esModule?e:{default:e}};Object.defineProperty(t,"__esModule",{value:!0});const r=n(o(860)),i=n(o(443)),s=n(o(801)),a=n(o(82)),u=r.default.Router();u.get("/",i.default.home),u.get("/data",i.default.initialData),u.get("/refresh",i.default.refreshSession),u.get("/private/token",a.default.token),u.get("/login",s.default.login),u.get("/logout",s.default.logout),t.default=u},752:function(e,t,o){var n=this&&this.__awaiter||function(e,t,o,n){return new(o||(o=Promise))((function(r,i){function s(e){try{u(n.next(e))}catch(e){i(e)}}function a(e){try{u(n.throw(e))}catch(e){i(e)}}function u(e){var t;e.done?r(e.value):(t=e.value,t instanceof o?t:new o((function(e){e(t)}))).then(s,a)}u((n=n.apply(e,t||[])).next())}))},r=this&&this.__importDefault||function(e){return e&&e.__esModule?e:{default:e}};Object.defineProperty(t,"__esModule",{value:!0});const i=r(o(860)),s=r(o(582)),a=r(o(806)),u=r(o(985)),c=r(o(616)),l=r(o(710)),d=r(o(470)),f=r(o(945)),h=r(o(17)),m=o(34),p=o(277),_=o(653),v=o(219),g=r(o(834)),w=(0,i.default)(),y=(0,g.default)({cookie:{key:"CSRF-TOKEN",httpOnly:!0,secure:v.IN_PROD||!1,maxAge:3600,path:"/",domain:v.IN_PROD?".resumemango.com":"localhost",sameSite:"lax"}}),k=(0,f.default)(p.auth);w.set("views",h.default.join(__dirname,"views")),w.set("view engine","ejs"),w.disable("x-powered-by"),v.IN_PROD||w.use((0,s.default)({origin:!0,credentials:!0})),w.use(i.default.json()),w.use(i.default.urlencoded({extended:!0})),w.use((0,l.default)()),w.use((0,d.default)("dev")),w.use((0,a.default)({crossOriginResourcePolicy:!1})),v.IN_STAGING||(w.set("trust proxy",["loopback","linklocal","uniquelocal"]),w.use(y),w.use(((e,t,o)=>{const n=e.csrfToken();t.cookie("XSRF-TOKEN",n,{httpOnly:!0,secure:v.IN_PROD||!1,maxAge:3600,path:"/",domain:v.IN_PROD?".resumemango.com":"localhost",sameSite:"lax"}),t.locals.csrfToken=n,o()})));const x=(0,u.default)({windowMs:6e4,max:100});w.use(x);const P={clientSecret:"PgSgMsCkB_7J93aroMdpLmTNFdKU4WLy1WcG7cS_9p46GBYNRzr4ikdLRXL_CYn9",clientID:"9saEJsETL1TYA9oMSRAI1hvLfUFtraZE",secret:"c5d20c60053920d1b36c467811c32a063a91153698ed3a560c18729a27b490fb",issuerBaseURL:"https://resumemango.us.auth0.com",baseURL:"https://resumemango.com",authRequired:!1,auth0Logout:!0,idpLogout:!0,authorizationParams:{response_type:"code",audience:"user-identifier",scope:"openid profile email offline_access"},routes:{login:!1,logout:!1,callback:"/auth/callback"},session:{name:"SID",store:new k({client:m.redisClient}),cookie:{domain:v.IN_PROD?".resumemango.com":"localhost",path:"/",transient:!1,httpOnly:!0,secure:v.IN_PROD,sameSite:"Lax"}},afterCallback:(e,t,o)=>n(void 0,void 0,void 0,(function*(){return t.cookie("rm_ia",!0,{expires:new Date(1e3*parseInt(o.expires_at)),path:"/",domain:v.IN_PROD?".resumemango.com":"localhost",sameSite:"lax",secure:v.IN_PROD}),o}))};w.use((0,p.auth)(P)),w.use("/auth",c.default),w.use(_.notFound,_.errorHandler),process.on("uncaughtException",(function(e){console.error(e),console.log("Node NOT Exiting...")})),t.default=w},219:(e,t)=>{Object.defineProperty(t,"__esModule",{value:!0}),t.IN_STAGING=t.IN_PROD=t.APP_ORIGIN=t.PORT=void 0;t.PORT="4001",t.APP_ORIGIN="http://localhost:4001",t.IN_PROD=!0,t.IN_STAGING=!1},34:function(e,t,o){var n=this&&this.__importDefault||function(e){return e&&e.__esModule?e:{default:e}};Object.defineProperty(t,"__esModule",{value:!0}),t.redisClient=void 0;const r=n(o(22)),i=n(o(495)),s=o(219).IN_PROD?"rm-cache.stmhwq.0001.use2.cache.amazonaws.com":"localhost",a={port:Number("6379"),host:s},u=new i.default(a);t.redisClient=u,u.on("connect",(()=>console.log(r.default.yellow.bold(`Redis connected on ${s}:${Number("6379")}`)))),u.on("error",(()=>console.log(r.default.red.bold(`Redis failed to connect on ${s}:${Number("6379")}`))))},728:function(e,t,o){var n=this&&this.__awaiter||function(e,t,o,n){return new(o||(o=Promise))((function(r,i){function s(e){try{u(n.next(e))}catch(e){i(e)}}function a(e){try{u(n.throw(e))}catch(e){i(e)}}function u(e){var t;e.done?r(e.value):(t=e.value,t instanceof o?t:new o((function(e){e(t)}))).then(s,a)}u((n=n.apply(e,t||[])).next())}))},r=this&&this.__importDefault||function(e){return e&&e.__esModule?e:{default:e}};Object.defineProperty(t,"__esModule",{value:!0});const i=r(o(22)),s=r(o(752)),a=o(219);n(void 0,void 0,void 0,(function*(){try{s.default.listen(a.PORT,(()=>console.log(i.default.blue.bold(`Server running on ${a.APP_ORIGIN}`))))}catch(e){console.error(i.default.red.bold(e,"trigger"))}}))},167:e=>{e.exports=require("axios")},22:e=>{e.exports=require("chalk")},945:e=>{e.exports=require("connect-redis")},710:e=>{e.exports=require("cookie-parser")},582:e=>{e.exports=require("cors")},834:e=>{e.exports=require("csurf")},860:e=>{e.exports=require("express")},277:e=>{e.exports=require("express-openid-connect")},985:e=>{e.exports=require("express-rate-limit")},806:e=>{e.exports=require("helmet")},931:e=>{e.exports=require("http-errors")},495:e=>{e.exports=require("ioredis")},470:e=>{e.exports=require("morgan")},17:e=>{e.exports=require("path")}},t={};!function o(n){var r=t[n];if(void 0!==r)return r.exports;var i=t[n]={exports:{}};return e[n].call(i.exports,i,i.exports,o),i.exports}(728)})();
//# sourceMappingURL=bundle.js.map