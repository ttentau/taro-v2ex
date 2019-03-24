import Taro, {Component} from '@tarojs/taro'
import {View, RichText, Image, Text} from '@tarojs/components'
import {AtAvatar} from 'taro-ui'

import {connect} from '@tarojs/redux'

import {add, minus, asyncAdd} from '../../actions/counter'

import './post.scss'
import Config from "../../config/config"
import commentPng from '../../assets/imgs/comment.png'


@connect(({counter}) => ({
    counter
}), (dispatch) => ({
    add() {
        dispatch(add())
    },
    dec() {
        dispatch(minus())
    },
    asyncAdd() {
        dispatch(asyncAdd())
    }
}))
class Post extends Component {

    config = {
        navigationBarTitleText: '首页',
        enablePullDownRefresh: true
    }

    constructor(props) {
        super(props)
        this.state = {
            post: {},
            comment: []
        }
    }

    async onPullDownRefresh() {
        await this.getData()
        Taro.stopPullDownRefresh()
    }

    componentWillMount() {
        this.getData()
    }

    async getData() {
        Taro.showLoading()
        let id = this.$router.params.id
        await this.getPost(id)
        await this.getComments(id)
    }

    getPost(id) {
        Taro.request({
            // url: Config.API_URL + 'api/topics/show.json?id=' + id,
            url:'https://www.v2ex.com/api/topics/show.json?id=' + id,
            method: 'get',
            data: {},
            header: {'content-type': 'application/json',}
        }).then(res => {
            let post = res.data[0]
            post.content_rendered = post.content_rendered.replace(/\<img/gi, '<img style="max-width:100%;height:auto" ')
            Taro.setNavigationBarTitle({
                title: post.title
            })
            this.setState({post})
        })
    }

    getComments(id) {
        Taro.request({
            // url: Config.API_URL + '/api/replies/show.json?topic_id=' + id,
            url:'https://www.v2ex.com/api/replies/show.json?topic_id=' + id,
            method: 'get',
            data: {},
            header: {'content-type': 'application/json',}
        }).then(res => {
            setTimeout(()=>{
                Taro.hideLoading()
            },500)
            this.setState({
                comment: res.data
            })
        })
    }

    componentDidMount() {
    }

    componentWillReceiveProps(nextProps) {
        console.log(this.props, nextProps)
    }

    componentWillUnmount() {
    }

    componentDidShow() {
    }

    componentDidHide() {
    }

    render() {
        let post = this.state.post
        let comments = this.state.comment.map((item, index) =>
            <View className='at-article__p comment' key={item.id}>
                <View className='info'>
                    <AtAvatar size='small' image={item.member.avatar_normal}/>
                    <View className='section'>
                        <View className='title'>
                            <View>
                                <Text>{item.member.username}</Text>
                                <Text className='index'>{index + 1}楼</Text>
                            </View>
                            <View className='date'>{new Date(item.created * 1000).toLocaleDateString()}</View>
                        </View>
                        <View className='reply'>
                            <Image src={commentPng}/>
                        </View>
                    </View>
                </View>
                <RichText nodes={item.content_rendered}/>
            </View>
        )
        return (
            <View className='at-article post'>
                <View className='at-article__h1'>
                    {post.title}
                </View>
                <View className='at-article__info'>
                    <Text>{new Date(post.created * 1000).toLocaleDateString()}</Text>
                    <Text className='author'>{post.member.username}</Text>
                </View>
                <View className='at-article__content'>
                    <View className='at-article__section'>
                        <View className='at-article__p'>
                            <RichText nodes={post.content_rendered}/>
                        </View>
                    </View>
                </View>
                <View className='comments'>{comments}</View>
            </View>
        )
    }
}

export default Post
