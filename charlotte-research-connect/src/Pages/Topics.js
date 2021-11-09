import React, { useEffect, useState } from 'react'
import axios from 'axios'
import PageTemplate from '../Components/PageTemplate'
import '../css/Topics.css'
const settings = require('../settings.json')

function TopicPage(props) {
    const [topics, setTopics] = useState([])
    const [selectedTopic, setSelectedTopic] = useState(null)
    const [subTopicList, setSubTopics] = useState([])

    useEffect(() => {
        const getTopics = async () => {
            const data = await axios.get(`${settings.DevEnv ? settings.NoSSL : settings.APIBase}/topics/overview`)
                .catch(er => { return { isErrored: true, er } })
            if (data.isErrored || !data.data) setTopics({ errored: true })
            else setTopics(data.data)
        }
        getTopics()
    }, [])

    const renderTopic = (topic) => {
        return (
            <h2 key={topic.id} className='Topic' onClick={() => selectTopic(topic)}>{topic.label}</h2>
        )
    }

    const renderSubTopic = (topic) => {
        return (
            <h2 key={topic.id} className='Topic' onClick={() => alert('yahoo')}>{topic.label}</h2>
        )
    }

    const selectTopic = async topic => {
        // Set selected topic state
        setSelectedTopic(topic.label);

        // Call API to get sub topics
        const data = await axios.get(`${settings.DevEnv ? settings.NoSSL : settings.APIBase}/topics/sub/${topic.id}`)
            .catch(er => { return { isErrored: true, er } })
        if (data.isErrored || !data.data) setTopics({ errored: true })

        // assume that data.data is an array
        setSubTopics(data.data)
    }

    return (<>
        <PageTemplate {...props} highLight='1' />
        <div className='TopicsPage'>
            <div className='TopicsContainer'>
                <div style={{ display: 'inline-flex', alignItems: 'center', cursor: selectedTopic ? 'pointer' : 'auto' }} onClick={() => { if (selectedTopic) setSelectedTopic(null) }}>
                    {selectedTopic ? <i class="material-icons" style={{ paddingRight: '.5rem' }}>arrow_back</i> : <></>}
                    <h1>{selectedTopic ? 'Back To Topics' : 'Topics'}</h1>
                </div>
                <div className='break' />
                <hr style={{ margin: '1rem', width: '60vw' }} />
                <div className='break' />
                {topics.errored ?
                    <h2>Error Getting Topics</h2> :
                    selectedTopic ? <>
                        <h1>You Selected {selectedTopic}</h1>
                        <div className='break' style={{ paddingTop: '3rem' }} />
                        {subTopicList.map(t => { return renderSubTopic(t) })}
                    </> :
                        topics.map(t => { return renderTopic(t) })
                }
            </div>
        </div>
    </>)
}

export default TopicPage