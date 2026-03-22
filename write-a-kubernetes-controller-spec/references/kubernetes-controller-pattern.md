# Controller Pattern

Use the general pattern of CreateOrUpdate around a mutate function:

## Option 1: Minimal Pseudo-Code (Most Concise)

```go
func Reconcile(ctx, req) (Result, error) {
    resource := GetResource(req)
    if NotFound { return nil }

    if err := validateResource(resource); err != nil {
        return updateStatus(resource, error)
    }

    return reconcileResources(ctx, resource)
}

func reconcileResources(ctx, resource) (Result, error) {
    // Create/update child resources
    CreateOrUpdate(ctx, client, childResource, func() error {
        return mutateChildResource(resource, childResource)
    })

    // Aggregate status from children
    status := getResourceStatus(ctx, resource)
    status.ObservedGeneration = resource.Generation
    updateStatus(ctx, resource, status)

    if !status.Ready {
        return RequeueAfter(30s)
    }
    return Success
}

func mutateChildResource(parent, child) error {
    SetControllerReference(parent, child)
    CopyLabelsAndAnnotations(parent, child)
    SetManagedAnnotations(child)
    ConfigureSpec(child)
    return nil
}
```

## Option 2: Detailed Pseudo-Code (More Context)

```go
type ResourceReconciler struct {
    client.Client
    Scheme  *runtime.Scheme
    Logger  *slog.Logger
    Metrics metrics.ControllerMetrics
}

func (r *Reconciler) Reconcile(ctx Context, req Request) (Result, error) {
    logger := r.Logger.With("resource", req.NamespacedName)
    r.Metrics.IncReconcile("resource")

    // Fetch resource
    resource := GetResource(ctx, req.NamespacedName)
    if errors.IsNotFound {
        return ctrl.Result{}, nil
    }

    // Validate
    if err := r.validateResource(resource); err != nil {
        logger.Error("Validation failed", "error", err)
        return r.updateStatus(ctx, resource, Status{
            Ready: false,
            Status: err.Error()
        })
    }

    // Reconcile resources
    result, err := r.reconcileResources(ctx, logger, resource)
    if err != nil {
        logger.Error("Failed to reconcile resources", "error", err)
        return r.updateStatus(ctx, resource, Status{
            Ready: false,
            Status: err.Error()
        })
    }

    return result, nil
}

func (r *Reconciler) validateResource(resource) error {
    // Validate spec fields
    // Apply defaults if needed
    return validationError
}

func (r *Reconciler) reconcileResources(ctx, logger, resource) (Result, error) {
    // Optional: Handle prerequisites (zone lookups, etc.)

    // Create/update each child resource
    childResource := &ChildResource{
        ObjectMeta: metav1.ObjectMeta{
            Name:      resource.GetName(),
            Namespace: resource.GetNamespace(),
        },
    }

    result, err := controllerutil.CreateOrUpdate(ctx, r.Client, childResource, func() error {
        return r.mutateChildResource(resource, childResource, additionalParams...)
    })
    if err != nil {
        return ctrl.Result{}, fmt.Errorf("failed to reconcile child: %w", err)
    }

    util.LogCreateOrUpdateResult(logger, r.Metrics, result, "controller", "ChildKind", "description", childResource.GetName())

    // Aggregate status
    status, err := r.getResourceStatus(ctx, logger, resource)
    if err != nil {
        return ctrl.Result{}, fmt.Errorf("failed to get status: %w", err)
    }

    // Update status
    _, err = r.updateStatus(ctx, resource, status)
    if err != nil {
        return ctrl.Result{}, err
    }

    // Requeue if not ready
    if !status.Ready {
        r.Metrics.IncRequeue("controller", "reason")
        return ctrl.Result{RequeueAfter: time.Second * 30}, nil
    }

    logger.Info("reconciliation completed successfully")
    return ctrl.Result{}, nil
}

func (r *Reconciler) mutateChildResource(parent, child, params...) error {
    // Set controller reference (ownership)
    if err := controllerutil.SetControllerReference(parent, child, r.Scheme); err != nil {
        return fmt.Errorf("failed to set controller reference: %w", err)
    }

    // Copy labels and annotations from parent
    util.CopyLabelsAndAnnotations(parent, child)

    // Configure child resource spec (only controller-managed fields)
    child.Spec.Field1 = &value1
    child.Spec.Field2 = value2

    return nil
}

func (r *Reconciler) getResourceStatus(ctx, logger, resource) (Status, error) {
    status := Status{Ready: false}

    // Get child resource
    childResource := GetChildResource(ctx, resource.Name, resource.Namespace)
    if errors.IsNotFound {
        status.Status = "waiting for child to be created"
        return status, nil
    }

    // Check child resource readiness (adapt to the child resource's status model)
    if childResource.Status.Ready {
        status.Ready = true
        status.SomeField = childResource.Status.SomeField
    } else {
        status.Status = "child not ready"
    }

    return status, nil
}

func (r *Reconciler) updateStatus(ctx, resource, status) (Result, error) {
    // observedGeneration lets consumers know whether status reflects the latest spec.
    status.ObservedGeneration = resource.GetGeneration()
    resource.Status = status
    if err := r.Status().Update(ctx, resource); err != nil {
        r.Logger.Error("Failed to update status", "error", err)
        return ctrl.Result{}, err
    }
    return ctrl.Result{}, nil
}

func (r *Reconciler) SetupWithManager(mgr) error {
    return ctrl.NewControllerManagedBy(mgr).
        For(&api.Resource{}).
        Owns(&ChildResource1{}).
        Owns(&ChildResource2{}).
        Complete(r)
}
```

## Option 3: Flow Diagram Format

```
Reconcile
├─ Get(resource)
│  └─ if NotFound → return nil
├─ validateResource(resource)
│  └─ if error → updateStatus(error) → return
├─ reconcileResources(resource)
│  ├─ CreateOrUpdate(child, mutateChild)
│  │  ├─ SetControllerReference
│  │  ├─ CopyLabelsAndAnnotations
│  │  └─ ConfigureSpec
│  ├─ getResourceStatus()
│  │  ├─ Get(child)
│  │  └─ Check child resource readiness
│  ├─ updateStatus(status)
│  │  └─ status.ObservedGeneration = resource.Generation
│  └─ if !Ready → RequeueAfter(30s)
└─ return Result
```
