import Head from 'next/head'
import Link from 'next/link'
import { GetServerSideProps } from 'next'
import React from 'react';
import got from 'got';
import { Random } from '../helpers/random';
import { ResponseCheck } from '../helpers/responseCheck';

class Rect extends React.Component<IRectProps, {}> {
    render() {
        return <svg version="1.1"
            baseProfile="full"
            width="100%" height="100%"
            xmlns="http://www.w3.org/2000/svg"
        >
            <rect width="100%" height="100%" fill={this.props.color || "white"} />
        </svg>;
    }
}

class RecordPreview extends React.Component<{ response: ISimplifiedResponse, onMouseOver: () => void, onMouseLeave: () => void }, {}> {

    anomalyCheck(x: ISimplifiedResponse): boolean {
        return ResponseCheck.anomalyDetech(x);
    }

    render() {
        const anomaly = this.anomalyCheck(this.props.response);
        let rect = <Rect color={"#2aa198"} />;

        if (anomaly) {
            rect =  <Rect color={"#d33682"} />;
        }

        return (
            <div 
                className="mr-1" 
                onMouseOver={e => this.props.onMouseOver()}
                onMouseLeave={e => this.props.onMouseLeave()}
            >
                {rect}
            </div>
        );
    }
}

class RecordsPreview extends React.Component<
    IRecordsPreviewProps, 
    { 
        responses: ISimplifiedResponse[], 
        reportWords: string, 
        summaryWords: string 
    }
> {
    constructor(props: IRecordsPreviewProps) {
        super(props);

        const nPick = 30;
        let responses = Random.simpleRandomSampling<ISimplifiedResponse>(this.props.responses, nPick);
        let summaryWords = "一天之内：No report(s).";
        if (responses.some(r => ResponseCheck.anomalyDetech(r))) {
            summaryWords = "一天之内：Anomaly(ies) exists.";
        }

        responses = responses.sort((a, b) => a.requestIgnitedAt - b.requestIgnitedAt);

        this.state = {
            reportWords: "",
            summaryWords,
            responses
        };
    }

    onMouseOver(r: ISimplifiedResponse) {
        const time = new Date(r.requestIgnitedAt).toLocaleTimeString();

        let reportWords = "";
        
        if (r.errorCode || r.errorMessage) {
            reportWords = `时间：${time} 错误码：${r.errorCode || ""} 错误信息：${r.errorMessage}`;
        }
        else {
            reportWords = `时间：${time} 状态码：${r.statusCode} 消息：${r.statusMessage} 延迟：${r.roundTrip}`;
        }

        this.setState({
            reportWords
        });
    }

    onMouseLeave() {
        this.setState({
            reportWords: ""
        });
    }

    render() {

        return (
            <div className="mb-8">
            <h2 className="font-sans text-lg mb-4">{this.state.responses[0].siteName}</h2>
            <h3 className="mb-4">{this.state.reportWords || this.state.summaryWords}</h3>
            <div className="flex flex-nowrap max-h-16 border-2 border-gray-400 p-1 pr-0 mb-8">
                {
                    this.state.responses.map(r => (
                        <RecordPreview 
                            key={r.requestId} 
                            onMouseOver={() => this.onMouseOver(r)} 
                            onMouseLeave={() => this.onMouseLeave()}
                            response={r} 
                        />
                    ))
                }
            </div>
            </div>
        );
    }
}

class DailyLog extends React.Component<IDailyLogProps, {}> {
    render() {
        return <div className="mb-8">
            <h3 className="text-lg mb-4">{`${this.props.monthName} ${this.props.day}:`}</h3>
            <div>
                {this.props.content.map(p => <p key={p} className="mb-4">{p}</p>)}
            </div>
        </div>;
    }
}

class RecordsSection extends React.Component {
    render() {
        return <div className="mb-8">
            <h2 className="text-2xl mb-8">监测记录概要</h2>
            {this.props.children}
        </div>;
    }
}

class LogsSection extends React.Component {
    render() {
        return <div className="mb-8">
            <h2 className="text-2xl mb-8">日志记录</h2>
            {this.props.children}
        </div>;
    }
}

class GeneralCheck extends React.Component<{}, { positive: boolean }> {

    constructor(props: {}) {
        super(props);
        
        this.state = {
            positive: false
        }

    }

    componentDidMount() {
        this.updateCheckResult();
    }

    async updateCheckResult() {
        const generalCheckEndPoint = "https://servers-ping.vercel.app/api/lastcheck";
        await window.fetch(generalCheckEndPoint)
        .then(d => d.json())
        .then(d => {
            const { result: { positive } }  = d;
            this.setState({ positive });
        })
        .catch(e => console.log(e));
    }

    render() {
        let title = "所有子系统状态正常";

        if (this.state.positive) {
            title = "需要系统管理员介入";
        }

        const headEle = <Head>
            <title>{title}</title>
        </Head>;

        return <div>
            {headEle}
            <h1 className="font-sans text-3xl mb-8">{title}</h1>
        </div>;
    }
    
}

export default class Home extends React.Component<IHomeProps, {}> {

    constructor(props: IHomeProps) {
        super(props);
    }

    classifyByURL(responses: ISimplifiedResponse[]): IndexedISimplifiedResponses {
        let idx = {};
        for (const res of responses) {
            if (!(res.url in idx)) {
                idx[res.url] = [];
            }
            idx[res.url].push(res);
        }

        return idx;
    }


    render() {
        const responses = this.props.responses;
        const indexedResponses = this.classifyByURL(responses);

        let recordsPreviews = [];
        for (const k in indexedResponses) {
            recordsPreviews.push(
                <RecordsPreview key={k} responses={indexedResponses[k]} />
            );
        }

        return <div className="mt-8 ml-auto mr-auto max-w-3xl p-4">
            <GeneralCheck />
            <hr className="mb-8"/>
            <RecordsSection>
                {recordsPreviews}
            </RecordsSection>
            <hr className="mb-8" />
            <LogsSection>
                {this.props.dailyLogs.map(l => <DailyLog key={l.content[0]} {...l} />)}
            </LogsSection>
        </div>
    }
}

export const getServerSideProps: GetServerSideProps = async context => {

    const apiEndPoint = "https://servers-ping.vercel.app/api";
    const responses = await got(`${apiEndPoint}/responses`).json();
    const targets = await got(`${apiEndPoint}/watchlist`).json();
    const dailyLogs = await got(`${apiEndPoint}/dailylogs`).json();

    return {
        props: {
            targets, responses, dailyLogs
        }
    };
}