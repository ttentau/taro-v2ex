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
        console.log(this.$router.params) // 输出 { id: 2, type: 'test' }
        let id = this.$router.params.id
        Taro.request({
            url: 'http://localhost:12345/api/topics/show.json?id='+id,
            method: 'get',
            data: {},
            header: {
                'content-type': 'application/json',
                // Authentication: 'none'
            }
        }).then(res => {
            console.log(res.data)
            // this.setState({
            //     post: res.data
            // })

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
        let listItems = []
        return (
            <View>{listItems}</View>
        )
    }
}

export default Post
