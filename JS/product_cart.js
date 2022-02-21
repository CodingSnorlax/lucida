// 匯入 product modal 元件
import userProductModalObj from '../components/product_modal.js';

// veevalidate rules
Object.keys(VeeValidateRules).forEach(rule => {
    if (rule !== 'default') {
        VeeValidate.defineRule(rule, VeeValidateRules[rule]);
    }
});

// 讀取外部資源 (支援中文版的驗證)
VeeValidateI18n.loadLocaleFromURL('./zh_TW.json');

// Activate the locale
VeeValidate.configure({
    generateMessage: VeeValidateI18n.localize('zh_TW'),
    validateOnInput: true, // 調整為輸入字元立即進行驗證
});

// 根元件
const app = {

    data() {
        return{
            cartData: [],
            productData: [],
            prodcutId: '',
            isLoadingItem: '',
            qty: 1,

            // 表單欄位輸入資料 (帶入 API)
            form: {
                user: {
                    email: '',
                    name: '',
                    tel: '',
                    address: '',
                },
                message: '',
            },
        }
        
    },

    methods: {

        // 取得產品列表
        getProductList() {
            axios.get(`${base_url}/${api_path}/products/all`)

                .then(res => {
                    console.log(res.data);
                    this.productData = res.data.products;
                })
                .catch(err => {
                    console.log(err);
                })
        },

        // 開啟 modal 元件
        openProductModal(id) {
            // 從根元件用 props 傳入產品 id 到 modal 內
            this.prodcutId = id;
            this.$refs.productModal.openProductModal()
        },

        getCartData() {
            axios.get(`${base_url}/${api_path}/cart`)
                .then(res => {
                    console.log(res.data.data);
                    // 是個陣列
                    this.cartData = res.data.data;

                })
                .catch(err => {
                    console.log(err);
                })
        },

        // 購物車：加入產品
        // 產品數量：參數預設值 (商品數量為 1)
        addToCart(id, qty = 1) {

            const data = {
                "product_id": id,
                "qty": qty, // 也可以解構賦值只寫 qty
            };

            this.isLoadingItem = id;

            axios.post(`${base_url}/${api_path}/cart`, { data })
                .then(res => {
                    console.log(res.data.product);
                    alert('已成功加入購物車')
                    this.getCartData();
                    this.isLoadingItem = '';
                })
                .catch(err => {
                    console.log(err);
                })
        },

        // 修改購物車數量
        editCartItem(id, qty) {

            const data = {
                "product_id": id,
                "qty": qty,
            }

            axios.put(`${base_url}/${api_path}/cart/${id}`, { data })
                .then(res => {
                    console.log(res);
                    this.getCartData();
                })
                .catch(err => {
                    console.log(err);
                })

        },

        // 刪除單一購物車產品
        deleteSingleProductItem(id) {

            this.isLoadingItem = id;

            axios.delete(`${base_url}/${api_path}/cart/${id}`)
                .then(res => {
                    alert('產品已刪除')
                    this.getCartData();
                    this.isLoadingItem = '';
                })
                .catch(err => {
                    console.log(err);
                })
        },

        // 清空購物車所有產品
        deleteAllCartItems() {

            axios.delete(`${base_url}/${api_path}/carts`)
                .then(res => {
                    console.log(res.data);
                    alert('購物車已清空')
                    this.getCartData();
                    this.form = '';
                })
                .catch(err => {
                    console.log(err);
                })

        },

        // 送出訂單
        sendOrder() {

            axios.post(`${base_url}/${api_path}/order`, { data: this.form })
                .then(res => {
                    console.log(res.data);
                    alert(res.data.message);
                    this.getCartData()          
                })
                .catch(err => {
                    console.log(err);
                })

        },

        // 套件：電話號碼規則
        isPhone(value) {
            const phoneNumber = /^(09)[0-9]{8}$/
            return phoneNumber.test(value) ? true : '請輸入有效的電話號碼'
        }

    },

    mounted() {

        this.getProductList();
        this.getCartData();
    }

};

// Vue 以 cdn 載入的子元件
Vue.createApp(app)
    // 註冊 modal 元件
    .component('userProductModal', userProductModalObj)
    // .component('user-product-modal', {
    // template: '#userProductModal',
    // props: ['id'],
    // data(){
    //     return{
    //         bsModal: {},
    //         productInModal: {},
    //         qty: 1,
    //     }
    // },
    // watch: {

    //     // 監控來自 props 的 id，只要畫面上 id 產生變動就會觸發抓取 modal 內不同筆資料
    //     id(){
    //         this.getModalProductList();
    //     }
    // },
    // methods: {

    //     openProductModal(){
    //         this.bsModal.show();
    //     },

    //     closeProductModal(){
    //         this.bsModal.hide();
    //     },

    //     // 抓取單筆產品資料 (開 modal 的時候就打這支 API)
    //     getModalProductList(){
    //         axios.get(`${base_url}/${api_path}/product/${this.id}`)
    //         .then(res => {
    //             console.log(res.data.product);
    //             this.productInModal = res.data.product;
    //         })
    //         .catch(err => {
    //             console.log(err);
    //         })
    //     },


    //     // 在 modal 內新增產品數量
    //     addToCart(){
    //         console.log(this);
    //         console.log(this.id, '哪裡來的？');
    //         this.$emit('add-to-cart', this.id, this.qty);
    //         this.closeProductModal()
    //     },

    // },

    // // $refs
    // mounted(){

    //     // 初始化 Boostrap 商品列表 modal
    //     this.bsModal = new bootstrap.Modal(document.getElementById('productModal'), {
    //         keyboard: false
    //     });

    // }
    // })

    // 驗證套件組
    .component('VForm', VeeValidate.Form)
    .component('VField', VeeValidate.Field)
    .component('ErrorMessage', VeeValidate.ErrorMessage)


    .mount('#app');