import Taro, {Component} from '@tarojs/taro'
import {View} from '@tarojs/components'
import {AtAvatar} from 'taro-ui'

import {connect} from '@tarojs/redux'

import {add, minus, asyncAdd} from '../../actions/counter'

import './index.scss'
import Config from "../../config/config"


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
class Index extends Component {

    config = {
        navigationBarTitleText: '首页',
        enablePullDownRefresh: true
    }

    constructor(props) {
        super(props)
        this.state = {
            post: []
        }
    }

    async onPullDownRefresh() {
        await this.getData()
        Taro.stopPullDownRefresh()
    }

    async getData() {
        let res = await Taro.request({
            // url: Config.API_URL + '/api/topics/latest.json',
            url: 'https://www.v2ex.com'+ '/api/topics/latest.json',
            // url: 'https://www.v2ex.com/api/topics/hot.json',
            method: 'get',
            data: {},
            header: {
                'content-type': 'application/json',
                // Authentication: 'none'
            }
        })
        Taro.hideLoading()
        this.setState({
            post: res.data
        })
    }

    componentWillMount() {
        Taro.showLoading()
        this.getData()
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

    goPostDetail = (id, e) => {
        // 跳转到目的页面，打开新页面
        Taro.navigateTo({
            url: '/pages/post/post?id=' + id
        })
    }

    render() {

        let listItems = this.state.post.map(item =>
            <View className='post' key={item.id} onClick={this.goPostDetail.bind(this, item.id)}>
                <View className='left'>
                    <AtAvatar size='small' image={item.member.avatar_normal}></AtAvatar>
                    <View className='replies'>{item.replies}</View>
                </View>
                <View className='right'>
                    <View className='title'>{item.title}</View>
                    <View className='info'>
                        <View className='node'>{item.node.title}</View>
                        <View className='time'>{new Date(item.created * 1000).toLocaleDateString()}-{new Date(item.created * 1000).toLocaleTimeString()}</View>
                    </View>
                </View>
            </View>
        )
        return (
            <View>{listItems}</View>
        )
    }
}

export default Index


/*



*  <View className='index'>
                <Button className='add_btn' onClick={this.props.add}>+</Button>
                <Button className='dec_btn' onClick={this.props.dec}>-</Button>
                <Button className='dec_btn' onClick={this.props.asyncAdd}>async</Button>
                <View><Text>{this.props.counter.num}</Text></View>
            </View>
*
*
* */
