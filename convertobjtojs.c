#include <stdio.h>
#include <string.h>

int main(void)
{
    FILE *fptr = fopen("FinalBaseMesh.obj", "r");
    FILE *out  = fopen("humanmesh.js", "w");

    if (fptr == NULL || out == NULL) {
        printf("Couldn't open file.\n");
        return 1;
    }

    char buffer[256];

    float x, y, z;
    int a, b, c;

    while (fgets(buffer, sizeof(buffer), fptr))
    {
        if (strncmp(buffer, "v ", 2) == 0)
        {
            sscanf(buffer, "v %f %f %f", &x, &y, &z);

            fprintf(out,
                    "{x:%f, y:%f, z:%f},\n",
                    x, y, z);
        }
        else if (strncmp(buffer, "f ", 2) == 0)
        {
            sscanf(buffer, "f %d %d %d", &a, &b, &c);

            fprintf(out,
                    "[%d,%d,%d],\n",
                    a , b , c );
        }
    }

    fclose(fptr);
    fclose(out);

    printf("Process complete!\n");

    return 0;
}