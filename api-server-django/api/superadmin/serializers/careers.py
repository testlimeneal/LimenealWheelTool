from rest_framework import serializers
from api.assessment.models import Job, CareerCluster, Bucket


class CareerClusterSerializer(serializers.ModelSerializer):
    class Meta:
        model = CareerCluster
        fields = '__all__'

class BucketSerializer(serializers.ModelSerializer):
    class Meta:
        model = Bucket
        fields = '__all__'

class JobSerializer(serializers.ModelSerializer):
    career_cluster = CareerClusterSerializer(read_only=True)
    career_cluster_id = serializers.PrimaryKeyRelatedField(queryset=CareerCluster.objects.all(), write_only=True,source='career_cluster')
    lwdimension_field1 = BucketSerializer(read_only=True)
    lwdimension_field2 = BucketSerializer(read_only=True)
    lwdimension_field3 = BucketSerializer(read_only=True)

    lwdimension_field1_id = serializers.PrimaryKeyRelatedField(queryset=Bucket.objects.all(), write_only=True, source='lwdimension_field1')
    lwdimension_field2_id = serializers.PrimaryKeyRelatedField(queryset=Bucket.objects.all(), write_only=True, source='lwdimension_field2')
    lwdimension_field3_id = serializers.PrimaryKeyRelatedField(queryset=Bucket.objects.all(), write_only=True, source='lwdimension_field3')

    class Meta:
        model = Job
        fields = '__all__'
    
    def create(self, validated_data):
        career_cluster_id = validated_data.pop('career_cluster_id', None)
        lwdimension_field1_id = validated_data.pop('lwdimension_field1_id', None)
        lwdimension_field2_id = validated_data.pop('lwdimension_field2_id', None)
        lwdimension_field3_id = validated_data.pop('lwdimension_field3_id', None)

        job = Job.objects.create(**validated_data)

        if career_cluster_id:
            job.career_cluster = CareerCluster.objects.get(pk=career_cluster_id)

        if lwdimension_field1_id:
            job.lwdimension_field1 = Bucket.objects.get(pk=lwdimension_field1_id)

        if lwdimension_field2_id:
            job.lwdimension_field2 = Bucket.objects.get(pk=lwdimension_field2_id)

        if lwdimension_field3_id:
            job.lwdimension_field3 = Bucket.objects.get(pk=lwdimension_field3_id)

        job.save()

        return job
    