1. Model :- Open source model , close source model
2. Fine tune the model : To get better results [training]
3. Deploy the model : k8 , sagemaker , 3p provider
4. Benchmark and Evaluate the model
5. Optimise the model

# First class citizens of LLMOmps

1. Prompts
2. token based cost strcuture
3. Conversational context
4. Latency senstivity

# Optimizing a model

 Optimise throughputs
 Reducing latency

1. Open source and closed source model --->

   1. use an existing model provider like openAI, Claude, simplismart, bedrock  
      Infra management  
      pay for what u use  

   2. Bring an open source model :- optimise it, wrap it over use some proxy layer {fastAPI}, deploy it  
      Take care of infra mangment  
      pay for the infra  

2. how we make existing provider production ready  

   1. Use ollama, vllm, triton server for model hosting and then wrap it with fastAPI server and then deploy and inference

![System Flow](assets/system.png)


## Observability (Monitoring / logging)
Governance

4 pillars of llm observability
1. CoreLLM metrics : latency , token throughput, error rate, model performace
2. Logs : What went wrong ? : request / response pair (Sanitized), error details stack trace, performance bottlenesk
3. Dashboarding : How to visualize these metrics
4. Alerting : If somethigg goes wrong , team should alerted
