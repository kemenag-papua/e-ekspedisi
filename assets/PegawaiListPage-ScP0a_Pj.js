import{E as e,I as t,K as n,M as r,S as i,T as a,Z as o,c as s,h as c,k as l,l as u,m as d,s as f,u as p,yt as m}from"./runtime-core.esm-bundler-lcUDIOtI.js";import{i as h,ut as g}from"./ripple-98qGE6kP.js";import{c as _,h as v,n as y,s as b,u as x}from"./index-B1DCksXg.js";import{t as S}from"./button-p-WSBhFZ.js";import{n as C,t as w}from"./column-nT5avvuy.js";import{t as T}from"./pegawai-xSCDRkVH.js";import{t as E}from"./unit-BYzukp0l.js";import{t as D}from"./confirmdialog-BO8-iRbB.js";var O=v.extend({name:`tag`,style:`
    .p-tag {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        background: dt('tag.primary.background');
        color: dt('tag.primary.color');
        font-size: dt('tag.font.size');
        font-weight: dt('tag.font.weight');
        padding: dt('tag.padding');
        border-radius: dt('tag.border.radius');
        gap: dt('tag.gap');
    }

    .p-tag-icon {
        font-size: dt('tag.icon.size');
        width: dt('tag.icon.size');
        height: dt('tag.icon.size');
    }

    .p-tag-rounded {
        border-radius: dt('tag.rounded.border.radius');
    }

    .p-tag-success {
        background: dt('tag.success.background');
        color: dt('tag.success.color');
    }

    .p-tag-info {
        background: dt('tag.info.background');
        color: dt('tag.info.color');
    }

    .p-tag-warn {
        background: dt('tag.warn.background');
        color: dt('tag.warn.color');
    }

    .p-tag-danger {
        background: dt('tag.danger.background');
        color: dt('tag.danger.color');
    }

    .p-tag-secondary {
        background: dt('tag.secondary.background');
        color: dt('tag.secondary.color');
    }

    .p-tag-contrast {
        background: dt('tag.contrast.background');
        color: dt('tag.contrast.color');
    }
`,classes:{root:function(e){var t=e.props;return[`p-tag p-component`,{"p-tag-info":t.severity===`info`,"p-tag-success":t.severity===`success`,"p-tag-warn":t.severity===`warn`,"p-tag-danger":t.severity===`danger`,"p-tag-secondary":t.severity===`secondary`,"p-tag-contrast":t.severity===`contrast`,"p-tag-rounded":t.rounded}]},icon:`p-tag-icon`,label:`p-tag-label`}}),k={name:`BaseTag`,extends:h,props:{value:null,severity:null,rounded:Boolean,icon:String},style:O,provide:function(){return{$pcTag:this,$parentInstance:this}}};function A(e){"@babel/helpers - typeof";return A=typeof Symbol==`function`&&typeof Symbol.iterator==`symbol`?function(e){return typeof e}:function(e){return e&&typeof Symbol==`function`&&e.constructor===Symbol&&e!==Symbol.prototype?`symbol`:typeof e},A(e)}function j(e,t,n){return(t=M(t))in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function M(e){var t=N(e,`string`);return A(t)==`symbol`?t:t+``}function N(e,t){if(A(e)!=`object`||!e)return e;var n=e[Symbol.toPrimitive];if(n!==void 0){var r=n.call(e,t);if(A(r)!=`object`)return r;throw TypeError(`@@toPrimitive must return a primitive value.`)}return(t===`string`?String:Number)(e)}var P={name:`Tag`,extends:k,inheritAttrs:!1,computed:{dataP:function(){return g(j({rounded:this.rounded},this.severity,this.severity))}}},F=[`data-p`];function I(t,n,a,o,c,d){return e(),p(`span`,i({class:t.cx(`root`),"data-p":d.dataP},t.ptmi(`root`)),[t.$slots.icon?(e(),s(r(t.$slots.icon),i({key:0,class:t.cx(`icon`)},t.ptm(`icon`)),null,16,[`class`])):t.icon?(e(),p(`span`,i({key:1,class:[t.cx(`icon`),t.icon]},t.ptm(`icon`)),null,16)):u(``,!0),t.value!=null||t.$slots.default?l(t.$slots,`default`,{key:2},function(){return[f(`span`,i({class:t.cx(`label`)},t.ptm(`label`)),m(t.value),17)]}):u(``,!0)],16,F)}P.render=I;var L={class:`space-y-4`},R={class:`flex items-center justify-between`},z={class:`rounded-xl border border-slate-200 bg-white shadow-sm`},B={key:0,class:`flex gap-1`},V={__name:`PegawaiListPage`,setup(r){let i=b(),l=x(),h=_(),g=y(),v=n(!1),O=n([]),k=n([]),A={super_admin:{label:`Super Admin`,severity:`warn`},admin:{label:`Admin`,severity:`info`},penerima:{label:`Penerima`,severity:`secondary`},pimpinan:{label:`Pimpinan`,severity:`success`}},j=e=>A[e]?.label||e,M=e=>A[e]?.severity||`secondary`,N=e=>k.value.find(t=>t.id===e)?.nama||`-`;async function F(){v.value=!0;try{let[e,t]=await Promise.all([T.getPegawaiList(),E.getUnitList()]);O.value=e.data?.items||[],k.value=t.data?.items||[]}catch(e){l.add({severity:`error`,summary:`Gagal Memuat Data`,detail:e.response?.data?.message||`Terjadi kesalahan`,life:5e3})}finally{v.value=!1}}function I(e){i.push(`/master/pegawai/${e}/edit`)}function V(e,t){h.require({message:`Hapus pegawai "${t}"?`,header:`Konfirmasi Hapus`,icon:`pi pi-exclamation-triangle`,acceptLabel:`Ya, Hapus`,rejectLabel:`Batal`,accept:async()=>{try{await T.deletePegawai(e),l.add({severity:`success`,summary:`Berhasil`,detail:`Pegawai dihapus`,life:3e3}),F()}catch(e){l.add({severity:`error`,summary:`Gagal`,detail:e.response?.data?.message||`Terjadi kesalahan`,life:5e3})}}})}return a(F),(n,r)=>(e(),p(`div`,L,[c(o(D)),f(`div`,R,[r[1]||=f(`div`,null,[f(`h3`,{class:`text-xl font-semibold text-slate-900`},`Master Pegawai`),f(`p`,{class:`text-sm text-slate-500`},`Kelola pengguna aplikasi.`)],-1),o(g).isSuperAdmin?(e(),s(o(S),{key:0,label:`Tambah Pegawai`,icon:`pi pi-plus`,onClick:r[0]||=e=>o(i).push(`/master/pegawai/tambah`)})):u(``,!0)]),f(`div`,z,[c(o(C),{value:O.value,loading:v.value,"data-key":`id`,paginator:!0,rows:10,"paginator-template":`FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink`,class:`text-sm`},{empty:t(()=>[...r[2]||=[f(`div`,{class:`py-8 text-center text-slate-400`},[f(`i`,{class:`pi pi-inbox mb-2 block text-3xl`}),d(` Belum ada data. `)],-1)]]),default:t(()=>[c(o(w),{field:`nama`,header:`Nama`,sortable:``}),c(o(w),{field:`username`,header:`Username`,sortable:``}),c(o(w),{field:`role`,header:`Role`,sortable:``},{body:t(({data:e})=>[c(o(P),{value:j(e.role),severity:M(e.role)},null,8,[`value`,`severity`])]),_:1}),c(o(w),{field:`unit_id`,header:`Unit`},{body:t(({data:e})=>[d(m(N(e.unit_id)),1)]),_:1}),c(o(w),{field:`email`,header:`Email`}),c(o(w),{field:`is_active`,header:`Status`},{body:t(({data:e})=>[c(o(P),{value:e.is_active===`true`||e.is_active===!0?`Aktif`:`Nonaktif`,severity:e.is_active===`true`||e.is_active===!0?`success`:`danger`},null,8,[`value`,`severity`])]),_:1}),c(o(w),{header:`Aksi`,style:{width:`140px`}},{body:t(({data:t})=>[o(g).isSuperAdmin?(e(),p(`div`,B,[c(o(S),{icon:`pi pi-pencil`,severity:`secondary`,text:``,rounded:``,"aria-label":`Edit`,onClick:e=>I(t.id)},null,8,[`onClick`]),c(o(S),{icon:`pi pi-trash`,severity:`danger`,text:``,rounded:``,"aria-label":`Hapus`,onClick:e=>V(t.id,t.nama)},null,8,[`onClick`])])):u(``,!0)]),_:1})]),_:1},8,[`value`,`loading`])])]))}};export{V as default};