export default {

    template: '#userProductModal',
    props: ['id'],
    data(){
        return{
            bsModal: {},
            productInModal: {},
            qty: 1,
        }
    },
    watch: {

        // 監控來自 props 的 id，只要畫面上 id 產生變動就會觸發抓取 modal 內不同筆資料
        id(){
            this.getModalProductList();
        }
    },
    methods: {

        openProductModal(){
            this.bsModal.show();
        },

        closeProductModal(){
            this.bsModal.hide();
        },

        // 抓取單筆產品資料 (開 modal 的時候就打這支 API)
        getModalProductList(){
            axios.get(`${base_url}/${api_path}/product/${this.id}`)
            .then(res => {
                console.log(res.data.product);
                this.productInModal = res.data.product;
            })
            .catch(err => {
                console.log(err);
            })
        },
        

        // 在 modal 內新增產品數量
        addToCart(){
            console.log(this);
            console.log(this.id, '哪裡來的？');
            this.$emit('add-to-cart', this.id, this.qty);
            this.closeProductModal()
        },

    },

    // $refs
    mounted(){
        
        // 初始化 Boostrap 商品列表 modal
        this.bsModal = new bootstrap.Modal(document.getElementById('productModal'), {
            keyboard: false
        });
       
    }


}