import Taro, {Component} from '@tarojs/taro'
import {View, RichText} from '@tarojs/components'
import {AtAvatar} from 'taro-ui'

import {connect} from '@tarojs/redux'

import {add, minus, asyncAdd} from '../../actions/counter'

import './post.scss'


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
        navigationBarTitleText: '首页'
    }

    constructor(props) {
        super(props)
        this.state = {
            post: {},
            comment: []
        }
    }

    componentWillMount() {
        console.log(this.$router.params) // 输出 { id: 2, type: 'test' }
        let id = this.$router.params.id
        Taro.request({
            url: 'http://localhost:12345/api/topics/show.json?id='+id,
            // url: 'http://localhost:12345/api/topics/show.json?id=546361',
            method: 'get',
            data: {},
            header: {'content-type': 'application/json',}
        }).then(res => {
            this.setState({
                post: res.data[0]
            })
        })
        Taro.request({
            url: 'http://localhost:12345/api/replies/show.json?topic_id='+id,
            // url: 'http://localhost:12345/api/replies/show.json?topic_id=546361',
            method: 'get',
            data: {},
            header: {'content-type': 'application/json',}
        }).then(res => {
            this.setState({
                comment: res.data
            })
        })
        Taro.request({
            url: 'http://localhost:12345/api/replies/show.json?topic_id='+id,
            // url: 'http://localhost:12345/api/replies/show.json?topic_id=546361',
            method: 'get',
            data: {},
            header: {'content-type': 'application/json',}
        }).then(res => {
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
        let comments = this.state.comment.map((item,index) =>
            <View className='at-article__p' key={item.id}>{index}
                <RichText   nodes={item.content_rendered}/>
            </View>
        )
        return (
            <View className='at-article'>
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
                <View>{comments}</View>
            </View>
        )
    }
}

export default Post
