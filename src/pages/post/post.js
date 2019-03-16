import Taro, {Component} from '@tarojs/taro'
import {View} from '@tarojs/components'
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
            post: [1, 2, 3]
        }
    }

    componentWillMount() {

    }

    componentDidMount() {
        Taro.request({
            url: 'http://localhost:12345/api/topics/latest.json',
            method: 'get',
            data: {},
            header: {
                'content-type': 'application/json',
                // Authentication: 'none'
            }
        }).then(res => {
            console.log(res.data)
            this.setState({
                post: res.data
            })

        })
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
        let listItems = []
        return (
            <View>{listItems}</View>
        )
    }
}

export default Post
