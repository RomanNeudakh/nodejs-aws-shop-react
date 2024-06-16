import aws_cdk as cdk

from cdk_py.cdk_py_stack import CdkPyStack

app = cdk.App()
CdkPyStack(app, "CdkPyStackCrossCheck")
app.synth()
