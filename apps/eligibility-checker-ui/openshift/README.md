# OpenShift Deployment Guide

This directory contains OpenShift deployment manifests for the EFV UI application.

## Prerequisites

1. OpenShift CLI (`oc`) installed
2. Access to an OpenShift project/namespace
3. Logged in to OpenShift cluster: `oc login`

## Deployment Steps

### 1. Login to OpenShift

```bash
oc login <your-openshift-cluster-url>
```

### 2. Switch to Your Project

```bash
oc project <your-namespace>
```

### 3. Create ImageStream

```bash
oc apply -f openshift/imagestream.yaml
```

### 4. Create BuildConfig

Update the GitHub repository URL in `buildconfig.yaml`, then:

```bash
oc apply -f openshift/buildconfig.yaml
```

### 5. Start the Build

```bash
oc start-build efv-ui --follow
```

### 6. Deploy the Application

```bash
oc apply -f openshift/deployment.yaml
oc apply -f openshift/service.yaml
oc apply -f openshift/route.yaml
```

### 7. Get the Application URL

```bash
oc get route efv-ui
```

## Alternative: Deploy All at Once

```bash
cd apps/eligibility-checker-ui
oc apply -f openshift/
```

## Update Deployment

Update the `deployment.yaml` with your namespace:

```bash
sed -i 's/<namespace>/your-actual-namespace/g' openshift/deployment.yaml
```

## Verify Deployment

```bash
# Check pods
oc get pods

# Check deployment status
oc rollout status deployment/efv-ui

# Check logs
oc logs -f deployment/efv-ui

# Check route
oc get route efv-ui -o jsonpath='{.spec.host}'
```

## Rollback

```bash
oc rollout undo deployment/efv-ui
```

## Scale Application

```bash
# Scale up
oc scale deployment/efv-ui --replicas=3

# Scale down
oc scale deployment/efv-ui --replicas=1
```

## Environment Variables

To add environment variables:

```bash
oc set env deployment/efv-ui VITE_API_URL=https://api.example.com
```

## Troubleshooting

### View Build Logs
```bash
oc logs -f bc/efv-ui
```

### Describe Deployment
```bash
oc describe deployment efv-ui
```

### Check Events
```bash
oc get events --sort-by='.lastTimestamp'
```

### Access Pod Shell
```bash
oc rsh deployment/efv-ui
```

## Clean Up

To remove all resources:

```bash
oc delete -f openshift/
oc delete bc/efv-ui
oc delete is/efv-ui
```
