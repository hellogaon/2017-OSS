import React from 'react';
import MemoInfo from './MemoInfo';
import MemoCreate from './MemoCreate';
import { FormGroup,FormControl } from 'react-bootstrap';

import 'bootstrap/dist/css/bootstrap.css';

import update from 'react-addons-update';

export default class Memo extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedKey : -1,
            keyword: '',
            memodata4: []
        };
        this.handleChange = this.handleChange.bind(this);
        this.handleClick = this.handleClick.bind(this);
        this.handleCreate = this.handleCreate.bind(this);
        this.handleRemove = this.handleRemove.bind(this);
        this.handleEdit = this.handleEdit.bind(this);
    }

    componentWillMount(){
        const memodata4 = localStorage.memodata4;
        if(memodata4){
            this.setState({
                memodata4: JSON.parse(memodata4)
            });
        }
    }

    componentDidUpdate(prevProps, prevState){
        if(JSON.stringify(prevState.memodata4) !== JSON.stringify(this.state.memodata4)) {
            localStorage.memodata4 = JSON.stringify(this.state.memodata4);
        }
    }

    handleChange(e){
        this.setState({
            keyword: e.target.value
        });
    }

    handleClick(key){
        console.log('click');
        this.setState({
            selectedKey : key,
        });
    }

    handleCreate(memo){
        this.setState({
            memodata4: update(this.state.memodata4, { $push: [memo] })
        });
    }

    handleRemove(){
        if(this.state.selectedKey < 0){
            return;
        }
        this.setState({
            memodata4: update(this.state.memodata4,
                { $splice: [[this.state.selectedKey, 1]] }
            ),
            selectedKey: -1
        });
    }

    handleEdit(title, date, contents){
        this.setState({
            memodata4: update(this.state.memodata4,
                {
                    [this.state.selectedKey] : {
                        title: { $set: title },
                        date: { $set: date },
                        contents: { $set: contents }
                    }
                })
        });
    }

    render() {
        const mapToComponents = (data) => {
            data.sort();
            data = data.filter(
                (memo) => {
                    return memo.title.toLowerCase().indexOf(this.state.keyword) > -1;
                }
            );
            return data.map((memo, i) => {
                return (<MemoInfo
                        memo={memo}
                        key={i}
                        onRemove={this.handleRemove}
                        onEdit={this.handleEdit}
                        onClick={() => this.handleClick(i)}/>
                );
            });
        };

        return (
            <div>
              <MemoCreate
                  onCreate={this.handleCreate}
              />
              <FormGroup bsSize="xs">
                <FormControl
                    type="text"
                    placeholder="Title Search"
                    name="keyword"
                    value={this.state.keyword}
                    onChange={this.handleChange}
                />
              </FormGroup>
              <div>{mapToComponents(this.state.memodata4)}</div>
            </div>
        );
    }
}
