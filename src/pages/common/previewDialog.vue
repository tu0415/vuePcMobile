<template>
	<div class="preview">
		<el-dialog title="预览文章" width="1000px" :visible.sync="dataCloseVisible" :close-on-click-modal="false" :close-on-press-escape="false">
			<el-form :label-position="labelPosition" label-width="55px">
				<el-form-item label="标题: ">
					<div v-html="articleData.title"></div>
				</el-form-item>
				<el-form-item label="简介: ">
					<div v-html="articleData.summary"></div>
				</el-form-item>
				<el-form-item label="内容: ">
          <!-- <div class="content" v-childImg v-html="articleData.content"></div> -->
					<div class="content" v-html="articleData.content"></div>
				</el-form-item>
				<el-form-item label="类型: ">
					<template v-if="articleData.type == '0'">
						<div>普通文章</div>
					</template>
					<template v-else>
						<div>视频文章</div>
					</template>
				</el-form-item>
				<el-form-item label="标签: ">
					<template v-for="item in articleData.tags">
						<el-tag class="tagList" :key="item.id" type="success">{{item.name}}</el-tag>
					</template>
				</el-form-item>
			</el-form>
			<div class="operator">
				<el-button type="default" @click="closeEvt">关闭</el-button>
			</div>
		</el-dialog>
	</div>
</template>

<script>
	export default {
		name: "previewDialog",
		props: ['articleData'],
		data(){
			return {
				dataCloseVisible: true,
				labelPosition: 'left'
			}
		},
		directives: {
			childImg: {
				bind(el, binding) {
					setTimeout(function(){
						let pWidth = 905;
						if(el.querySelectorAll("img")){
							el.querySelectorAll("img").forEach(img => {
								let width = img.width;
								let height = img.height;
								if(width > pWidth){
									img.style.width = pWidth + 'px';
									img.style.height = parseInt((height * pWidth) / width) + "px";
								}else{
									img.style.width = img.width + "px"
									img.style.height = img.height + "px"
								}
							})
						}
						if(el.querySelectorAll("iframe")){
							el.querySelectorAll("iframe").forEach(iframe => {
								let width = iframe.offsetWidth;
								let height = iframe.offsetHeight;
								iframe.style.width = pWidth + 'px';
								iframe.style.height = parseInt((height * pWidth) / width)+ "px";
							})
						}
					}, 100)
				}
			}
		},
		watch: {
			dataCloseVisible() {
				this.$emit('update:dataVisible', this.dataCloseVisible)
			}
		},
		methods:{
			closeEvt(){
				this.dataCloseVisible = false
			}
		}
	}
</script>
<style>
	.preview .el-form-item{
		margin-bottom: 5px;
	}
	.preview .el-form-item__label,
	.preview .el-form-item__content{
		line-height: 30px;
	}
	.preview .content img, .preview .content iframe {
		margin: 5px auto 5px auto;
		border: none;
		outline: none;
		display: block;
		max-width: 100%;
	}
</style>
<style lang="less" scoped>
	.preview{
		.tagList{
			margin-right: 15px;
			cursor: pointer;
		}
		.operator{
			text-align: center;
		}
	}
</style>
