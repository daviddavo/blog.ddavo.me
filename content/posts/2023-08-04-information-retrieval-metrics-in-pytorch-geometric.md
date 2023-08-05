---
title: Computing information retrieval metrics in Pytorch Geometric
description: How to calculate metrics like precision@k, recall@k and r-precision for information retrieval and recommender systems in PyTorch Geometric
date: 2023-08-04T18:21:50.040Z
draft: false
tags:
  - artificial intelligence
  - PyTorch
categories:
  - tutorial
author: David Davó
slug: pytorch-geometric-metrics
math: true
lastmod: 2023-08-05T07:19:13.260Z
keywords:
  - precision
  - pytorch
  - pytorch geometric
  - recall
type: default
---

## Formulas and Definitions

There are multiple metrics used both in information retrieval and recommender systems that are analagous to standard metrics. Precision and recall at k (also called precision@k and recall@k) both answer the simple question of "whats the precision/recall if I retrieve k documents using my system".

> $$ p@k = \frac{|\\{\text{relevant documents}\\}\cap\\{\text{top k retrieved documents}\\}|}{k} $$

But with both of these metrics, the constant _k_ needs to be known. A user that only interacted 3 times with items will have a maximum p@5 of 3/5, but for a user with hundreds of interactions, scoring a good p@5 would be too easy for our system. Furthermore, if you have hundreds of interactions for every user, the recall will be pretty low.

If we could just vary the _k_ for each user... Thats when R-precission comes in handy. Is like precision@k, but the k is different for each user, and is equal to the number of relevant items for the user. The difference between the old simple recall and r-precision is that the number of documents to retrieve is equal to the number of relevant documents.

> $$ r-precision = \frac{\left|\\{\text{relevant documents}\\}\cap \\{\text{top R retrieved documents}\\}\right| }{R} $$
>
> Where \\(R = |\\{\text{relevant documents}\\}|\\)

## Implementation and PyTorch Geometric code

Let's imagine the graph is implemented as a tensor `edge_index` of size `[2,n_users]`, where `edge_index[0]` is the source of each edge, and `edge_index[1]` is the destination. We also have a model with a method `model.recommend` (like [LightGCN](https://pytorch-geometric.readthedocs.io/en/latest/generated/torch_geometric.nn.models.LightGCN.html?highlight=lightgcn)), that, given a value _k_ returns the top _k_ recommendations of nodes.

The code of the following function is thoroughly commented to make it easier to understand. It receives a k and returns both the precision and recall at k, and the R-precision.

I assume that the model and the graph are out of the scope of the function (they are global variables, or this functions is inside a bigger function).

```python
@torch.no_grad()
def prec_rec(k: int):
    # gt: ground truth (all edges)
    gt_index = original['voter', 'votes', 'proposal'].edge_index
    edge_index = validation['voter', 'votes', 'proposal'].edge_index

    # First, we will need to obtain the R value for each node
    # In graph terms, this is just the degree of the graph
    # (the number of items each user interacted with)
    R = item_count = PyG.utils.degree(gt_index[0], num_nodes=n_users)
    # Then, we get the top max(R) recomendations. This is a bit
    # expensive but less than sorting all the recommendations
    topr = model.recommend(edge_index, src_index=users, dst_index=items, k=int(R.max()))
    
    # We transform the pair of vertices format to a 
    # bipartite adjacency matrix
    ground_truth = torch.full((n_users, n_items), False, dtype=torch.bool, device=device)
    ground_truth[gt_index[0], gt_index[1] - n_users] = True

    # Then, we gather the results of that matrix using
    # the top recommendations obtained before
    isin_rmat = ground_truth.gather(1, topr - n_users)
    # For p@k and r@k we just need the first k recommendations
    isin_mat = isin_rmat[:, :k]

    # We calculate mean precision and recall using the formulas
    prec = (isin_mat.sum(dim=-1) / k).sum() / n_users
    rec = (isin_mat.sum(dim=-1) / item_count).sum() / n_users

    # We can't do isin_rmat[:, :R] because R is not an scalar
    # My solution is to create a mask with as much ones as R
    msk = torch.arange(1, R.max()+1, device=device) > R.unsqueeze(1)
    isin_rmat[msk] = 0
    # Calculate the mean R-precision using the formula
    rprec = (isin_rmat.sum(dim=-1) / R).sum() / n_users

    # Finally, we convert the 1-d one item tensors to float
    return float(prec), float(rec), float(rprec)
```

Even if you don't use PyTorch Geometric and you prefer other library, the code should be useful. Just accomodate the edge index and create a similar recommend method and you will be able to calculate r-precision.

## Sources and more information
- [PyTorch Geometric - Read The Docs](https://pytorch-geometric.readthedocs.io/en/latest/)
- [Wikipedia - Evaluation measures (information retrieval)](https://en.wikipedia.org/wiki/Evaluation_measures_(information_retrieval)#Precision_at_k)
- [StackOverflow - How to slice a 2D tensor using a 1D tensor instead of scalar](https://stackoverflow.com/questions/76837716/how-to-slice-a-2d-tensor-using-a-1d-tensor-instead-of-scalar)
- [PyTorch Forums - How to use a 1d tensor as an index to slice a 2d tensor](https://discuss.pytorch.org/t/how-to-use-a-1d-tensor-as-an-index-to-slice-a-2d-tensor/185736)