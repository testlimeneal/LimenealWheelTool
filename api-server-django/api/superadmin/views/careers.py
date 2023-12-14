from rest_framework import generics
from rest_framework.response import Response
from rest_framework import status
from api.assessment.models import Job, CareerCluster, Bucket
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