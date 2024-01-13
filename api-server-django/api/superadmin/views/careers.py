from rest_framework import generics
from rest_framework.response import Response
from rest_framework import status
from api.assessment.models import Job, CareerCluster, Bucket,Trait
from django.http import JsonResponse
from django.views import View

from api.superadmin.serializers.careers import JobSerializer, CareerClusterSerializer, BucketSerializer

class JobListCreateView(generics.ListCreateAPIView):
    queryset = Job.objects.all()
    serializer_class = JobSerializer

    def perform_create(self, serializer):
        serializer.save()

class JobDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Job.objects.all()
    serializer_class = JobSerializer



class CareerClusterAndBucketListView(generics.ListAPIView):
    queryset = CareerCluster.objects.all()
    serializer_class = CareerClusterSerializer

    def list(self, request, *args, **kwargs):
        # Get career clusters and buckets
        clusters = self.get_queryset()
        buckets = Bucket.objects.all()

        # Serialize the data
        cluster_serializer = CareerClusterSerializer(clusters, many=True)
        bucket_serializer = BucketSerializer(buckets, many=True)

        # Combine the serialized data
        data = {
            'career_clusters': cluster_serializer.data,
            'buckets': bucket_serializer.data,
        }

        return Response(data)
    


class GetDimensionsView(View):
    def get(self, request, *args, **kwargs):
        # Get all buckets
        buckets = Bucket.objects.all()

        # Initialize an empty list to store data for all buckets
        all_buckets_data = []

        # Loop through each bucket
        for bucket in buckets:
            # Get Bucket feature and id
            bucket_data = {
                'feature': bucket.feature,
                'id': bucket.id,
            }

            # Get virtue.virtue and virtue.id of that dimension
            virtue_data = {}
            if bucket.virtue:
                virtue_data = {
                    'virtue': bucket.virtue.virtue,
                    'virtue_id': bucket.virtue.id,
                }

            # Get Traits of that dimension
            traits_data = Trait.objects.filter(dimension=bucket)
            traits_dict = {index + 1: {'name': trait.name, 'id': trait.id} for index, trait in enumerate(traits_data)}


            # Combine all the data for the current bucket
            bucket_info = {
                'bucket': bucket_data,
                'virtue': virtue_data,
                'traits': traits_dict,
            }

            # Append the data to the list
            all_buckets_data.append(bucket_info)

        # Return the data for all buckets as JSON
        return JsonResponse(all_buckets_data, safe=False)